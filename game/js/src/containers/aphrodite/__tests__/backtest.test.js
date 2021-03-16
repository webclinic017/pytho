import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';

import {
  AphroditeApp as App,
} from '../index.js';

jest.mock('axios');

const backtestResponse = {
  data: {
    data: {
      'cagr': 0.1,
      'vol': 0.1,
      'maxdd': 0.1,
      'equityCurve': [
        [
          1504656000000, 100000.0,
        ],
        [
          1504742400000, 100000.0,
        ],
        [
          1504828800000, 100000.0,
        ],
        [
          1505088000000, 100000.0,
        ],
        [
          1505174400000, 100000.0,
        ],
        [
          1505260800000, 100000.0,
        ],
        [
          1505347200000, 100000.0,
        ],
        [
          1505433600000, 100000.0,
        ],
        [
          1505692800000, 100000.0,
        ],
        [
          1505779200000, 100000.0,
        ],
        [
          1505865600000, 100000.0,
        ],
        [
          1505952000000, 100000.0,
        ],
        [
          1506038400000, 100000.0,
        ],
      ],
    },
  },
};

const securitySearchResponse = {
  data: {
    coverage: [
      {
        id: 14651,
        country_name: 'united kingdom',
        name: 'Random Name',
        issuer: 'Random Issuer',
        currency: 'GBP',
        ticker: null,
        security_type: 'fund',
      },
      {
        id: 14652,
        country_name: 'united kingdom',
        name: 'Random Name 1',
        issuer: 'Random Issuer',
        currency: 'GBP',
        ticker: null,
        security_type: 'fund',
      },
      {
        id: 14653,
        country_name: 'united kingdom',
        name: 'Random Name 2',
        issuer: 'Random Issuer',
        currency: 'GBP',
        ticker: null,
        security_type: 'fund',
      },
    ],
  },
};

describe('Testing the functionality of the main app', () => {
  it('can render without error', () => {
    const app = render(<App />);
    expect(app).toBeTruthy();
  });

  it('has buttons disabled until asset and weight are filled', async () => {
    axios.get.mockReturnValue(Promise.resolve(securitySearchResponse));

    const app = render(<App />);
    expect(app.getByText(/Add to portfolio/)).toBeDisabled();

    const weightInput = app.getByTestId('backtest-weight-input');
    const securityInput = app.getByPlaceholderText('Search Security');

    fireEvent.change(weightInput, {
      target: {
        value: 10,
      },
    });
    expect(app.getByText(/Add to portfolio/)).toBeDisabled();

    userEvent.type(securityInput, 'Random');
    expect(securityInput.value).toBe('Random');
    await waitFor(() => app.findAllByText('Random Name'));

    await userEvent.click(app.getAllByText('Random Name')[0]);
    expect(app.getByText(/Add to portfolio/)).not.toBeDisabled();

    await userEvent.click(app.getByText('Add to portfolio'));
    expect(app.getByText(/Add to portfolio/)).toBeDisabled();
  });

  it('displays the portfolio details when an asset is added', async () => {
    axios.get.mockReturnValue(Promise.resolve(securitySearchResponse));

    const app = render(<App />);
    expect(app.getByText(/Add to portfolio/)).toBeDisabled();

    const weightInput = app.getByTestId('backtest-weight-input');
    const securityInput = app.getByPlaceholderText('Search Security');

    fireEvent.change(weightInput, {
      target: {
        value: 10,
      },
    });
    userEvent.type(securityInput, 'Random');
    await waitFor(() => app.findAllByText('Random Name'));
    await userEvent.click(app.getAllByText('Random Name')[0]);
    await userEvent.click(app.getByText('Add to portfolio'));

    expect(app.queryAllByText(/Random Name/)).toHaveLength(1);
  });

  it('can remove assets from portfolio', async () => {
    axios.get.mockReturnValue(Promise.resolve(securitySearchResponse));

    const app = render(<App />);
    expect(app.getByText(/Add to portfolio/)).toBeDisabled();

    const weightInput = app.getByTestId('backtest-weight-input');
    const securityInput = app.getByPlaceholderText('Search Security');

    fireEvent.change(weightInput, {
      target: {
        value: 10,
      },
    });
    userEvent.type(securityInput, 'Random');
    await waitFor(() => app.findAllByText('Random Name'));
    await userEvent.click(app.getAllByText('Random Name')[0]);
    await userEvent.click(app.getByText('Add to portfolio'));

    expect(app.queryAllByText(/Random Name/)).toHaveLength(1);

    await userEvent.click(app.getByTestId('backtest-removeassetbutton'));
    expect(app.queryAllByText(/Random Name/)).toHaveLength(0);
  });

  it('runs a backtest when the run button is pressed', async () => {
    axios.get.mockReturnValue(Promise.resolve(securitySearchResponse));

    const app = render(<App />);
    expect(app.getByText(/Add to portfolio/)).toBeDisabled();

    const weightInput = app.getByTestId('backtest-weight-input');
    const securityInput = app.getByPlaceholderText('Search Security');

    fireEvent.change(weightInput, {
      target: {
        value: 10,
      },
    });
    userEvent.type(securityInput, 'Random');
    await waitFor(() => app.findAllByText('Random Name'));
    await userEvent.click(app.getAllByText('Random Name')[0]);
    await userEvent.click(app.getByText('Add to portfolio'));

    axios.post.mockReturnValue(Promise.resolve(backtestResponse));
    await userEvent.click(app.getByText('Run Backtest'));
    await waitFor(() => app.findAllByText(/Cagr/));

    const url = process.env.API_URL + '/api/backtest';
    const input = {
      data: {
        assets: [
          14651,
        ],
        weights: [
          0.1,
        ],
      },
    };
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(url, input);
  });

  it('displays the results of a backtest', async () => {
    axios.get.mockReturnValue(Promise.resolve(securitySearchResponse));

    const app = render(<App />);
    expect(app.getByText(/Add to portfolio/)).toBeDisabled();

    const weightInput = app.getByTestId('backtest-weight-input');
    const securityInput = app.getByPlaceholderText('Search Security');

    fireEvent.change(weightInput, {
      target: {
        value: 10,
      },
    });
    userEvent.type(securityInput, 'Random');
    await waitFor(() => app.findAllByText('Random Name'));
    await userEvent.click(app.getAllByText('Random Name')[0]);
    await userEvent.click(app.getByText('Add to portfolio'));

    axios.post.mockReturnValue(Promise.resolve(backtestResponse));
    await userEvent.click(app.getByText('Run Backtest'));
    await waitFor(() => app.findAllByText(/Cagr/));

    expect(app.getByText(/Cagr/)).toBeTruthy();
    expect(app.getByText(/Vol/)).toBeTruthy();
    expect(app.getByText(/MaxDD/)).toBeTruthy();
  });
});
