import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect';

import {
  DemeterApp as App,
} from '../index.js';

jest.mock('axios');

const response = {
  data: {
    'simportfolio': {
      'values': [
        100,
        116.27,
        95.29,
      ],
      'returns': [
        0.1626606907335207, -0.18043859226312323,
      ],
      'cagr': -0.024,
      'volatility': 0.172,
      'maxdd': -0.18,
    },
    'benchmarkportfolio': {
      'values': [
        100,
        108.76,
        105.55,
      ],
      'returns': [
        0.08761910385133434, -0.029567855591805657,
      ],
      'cagr': 0.027,
      'volatility': 0.059,
      'maxdd': -0.03,
    },
    'sim_data': [
      [
        'Italy',
        'Italy',
        'Denmark',
        'Belgium',
      ],
      [
        1905,
        1969,
        1943,
        1951,
      ],
      [
        1951,
        2008,
        1982,
        1990,
      ],
    ],
  },
};


describe('Testing the functionality of the main app', () => {
  it('can reset the portfolio went the simulation is finished', async () => {
    const app = render(<App />);
    await waitFor(() => app.getByLabelText('weight-input-0'));

    const input = app.getByLabelText('weight-input-0');
    fireEvent.change(
        input, {
          target: {
            value: '100',
          },
        });
    await waitFor(() => app.getByText(/Next Step/));

    const leftClick = {
      button: 1,
    };

    axios.post.mockReturnValue(Promise.resolve(response));
    fireEvent.click( app.getByText('Next Step'), leftClick);
    await waitFor(() =>
      expect(app.getByTestId('forty-portfolioperiod').textContent).toBe('1'));

    fireEvent.click(
        app.getByText('Reset'), leftClick);
    await waitFor(() =>
      expect(app.queryByTestId('demeter-perfpanel')).not.toBeInTheDocument());

    await waitFor(() =>
      expect(
          app.queryByTestId('forty-portfolioperiod')).not.toBeInTheDocument());
    await waitFor(() =>
      expect(
          app.queryByTestId('forty-portfoliovalue')).not.toBeInTheDocument());
  });

  it('won\'t render the next step button at start', async () => {
    axios.post.mockReturnValue(Promise.resolve(response));
    const app = render(<App />);
    await waitFor(() => app.getByLabelText('weight-input-0'));

    expect(app.queryByText(/Next Step/).disabled).toBeTruthy();
  });

  it('returns errors to clients when the weight input is invalid', async () => {
    axios.post.mockReturnValue(Promise.resolve(response));
    const app = render(<App />);
    await waitFor(() => app.getByLabelText('weight-input-0'));

    const input = app.getByLabelText('weight-input-0');
    const inputTwo = app.getByLabelText('weight-input-1');

    fireEvent.change(
        input, {
          target: {
            value: 'cats',
          },
        });
    expect(app.queryByText(/Next Step/).disabled).toBeTruthy();
    await waitFor(() => app.getByText(/Weights Invalid/));
    expect(app.queryByText(/Weights Invalid/)).toBeTruthy();

    fireEvent.change(
        input, {
          target: {
            value: '-1',
          },
        });
    expect(app.queryByText(/Next Step/).disabled).toBeTruthy();
    await waitFor(() => app.getByText(/Weights Invalid/));
    expect(app.queryByText(/Weights Invalid/)).toBeTruthy();

    fireEvent.change(
        input, {
          target: {
            value: '101',
          },
        });
    expect(app.queryByText(/Next Step/).disabled).toBeTruthy();
    await waitFor(() => app.getByText(/Weights Invalid/));
    expect(app.queryByText(/Weights Invalid/)).toBeTruthy();

    fireEvent.change(
        input, {
          target: {
            value: '1000',
          },
        });
    expect(app.queryByText(/Next Step/).disabled).toBeTruthy();
    await waitFor(() => app.getByText(/Weights Invalid/));
    expect(app.queryByText(/Weights Invalid/)).toBeTruthy();

    fireEvent.change(
        input, {
          target: {
            value: '40',
          },
        });
    await waitFor(()=>
      expect(app.queryByText(/Weights Invalid/)).not.toBeInTheDocument());
    expect(app.queryByText(/Next Step/).disabled).toBeFalsy();
    expect(app.queryByText(/Weights Invalid/)).toBeNull();

    fireEvent.change(
        input, {
          target: {
            value: '40',
          },
        });
    fireEvent.change(
        inputTwo, {
          target: {
            value: '80',
          },
        });
    expect(app.queryByText(/Next Step/).disabled).toBeTruthy();
    await waitFor(() => app.getByText(/Weights Invalid/));
    expect(app.queryByText(/Weights Invalid/)).toBeTruthy();
  });

  it('will remove a weight without throwing an error', async () => {
    axios.post.mockReturnValue(Promise.resolve(response));
    const app = render(<App />);
    await waitFor(() => app.getByLabelText('weight-input-0'));

    const input = app.getByLabelText('weight-input-0');
    const inputTwo = app.getByLabelText('weight-input-1');

    fireEvent.change(
        input, {
          target: {
            value: '50',
          },
        });
    fireEvent.change(
        inputTwo, {
          target: {
            value: '50',
          },
        });
    fireEvent.change(
        input, {
          target: {
            value: '0',
          },
        });
    await waitFor(() => inputTwo.value == '0');

    expect(app.queryByText(/Next Step/)).toBeTruthy();
    expect(app.queryByText(/Weights invalid/)).toBeNull();
  });

  it('will update the weights correctly with input', async () => {
    axios.post.mockReturnValue(Promise.resolve(response));
    const app = render(<App />);
    await waitFor(() => app.getByLabelText('weight-input-0'));

    const input = app.getByLabelText('weight-input-0');
    fireEvent.change(
        input, {
          target: {
            value: '20',
          },
        });
    expect(input.value).toBe('20');
  });

  it('will update the portfolio with button click', async () => {
    axios.post.mockReturnValue(Promise.resolve(response));
    const app = render(<App />);
    await waitFor(() => app.getByLabelText('weight-input-0'));

    const input = app.getByLabelText('weight-input-0');
    fireEvent.change(
        input, {
          target: {
            value: '100',
          },
        });
    await waitFor(() => app.getByText(/Next Step/));

    const leftClick = {
      button: 1,
    };
    fireEvent.click(
        app.getByText('Next Step'), leftClick);
    await waitFor(() =>
      expect(app.getByTestId('forty-portfolioperiod').textContent).toBe('1'));

    fireEvent.click(
        app.getByText('Next Step'), leftClick);
    await waitFor(() =>
      expect(app.getByTestId('forty-portfolioperiod').textContent).toBe('2'));

    fireEvent.click(
        app.getByText('Next Step'), leftClick);
    await waitFor(() =>
      expect(app.getByTestId('forty-portfolioperiod').textContent).toBe('3'));

    expect(app.getByTestId('forty-portfoliovalue').textContent).toBe('95.29');
  });
});
