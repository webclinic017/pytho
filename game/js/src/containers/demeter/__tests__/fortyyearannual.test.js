import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import axios from 'axios';

import {
  DemeterApp as App,
} from '../index.js';

jest.mock('axios');

const response = {
  data: {
    data: [
      {
        period: 'Fake',
        data: [
          0.1,
          0.1,
          0.1,
        ],
      },
      {
        period: 'Fake',
        data: [
          0.1,
          0.1,
          0.1,
        ],
      },
      {
        period: 'Fake',
        data: [
          0.1,
          0.1,
          0.1,
        ],
      },
    ],
  },
};

describe('Testing the functionality of the main app', () => {
  it('can reset the portfolio went the simulation is finished', async () => {
    axios.get.mockReturnValue(Promise.resolve(response));
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
    fireEvent.click(
        app.getByText('Next Step'), leftClick);
    fireEvent.click(
        app.getByText('Next Step'), leftClick);

    expect(app.getByText('Reset')).toBeTruthy();
    fireEvent.click(
        app.getByText('Reset'), leftClick);

    // This is not great but we seem to need this because the app
    // is doing another fake api call and reloading the component tree
    await waitFor(() => setTimeout(() => true, 200));

    expect(app.getByTestId('forty-portfolioperiod').textContent).toBe('0');
    expect(app.getByTestId('forty-portfoliovalue').textContent).toBe('100.00');

    const inputUpdated = app.getByLabelText('weight-input-0');
    expect(inputUpdated.value).toBe('');
  });

  it('will show the client the periods when the sim is complete', async () => {
    axios.get.mockReturnValue(Promise.resolve(response));
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
    fireEvent.click(
        app.getByText('Next Step'), leftClick);
    fireEvent.click(
        app.getByText('Next Step'), leftClick);

    expect(app.getAllByText(/Fake/)).toBeTruthy();
    expect(app.getAllByText(/Fake/)).toHaveLength(3);
  });

  it('will tell client when sim is complete and remove button', async () => {
    const response = {
      data: {
        data: [
          {
            period: 'Fake',
            data: [
              0.1, 0.1,
            ],
          }, {
            period: 'Fake',
            data: [
              0.1, 0.1,
            ],
          },
        ],
      },
    };

    axios.get.mockReturnValue(Promise.resolve(response));
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
    fireEvent.click(
        app.getByText('Next Step'), leftClick);

    expect(app.queryByText(/Next Step/).disabled).toBeTruthy();
    expect(app.queryByText(/Sim complete/)).toBeTruthy();
  });

  it('won\'t render the next step button at start', async () => {
    axios.get.mockReturnValue(Promise.resolve(response));
    const app = render(<App />);
    await waitFor(() => app.getByLabelText('weight-input-0'));

    expect(app.queryByText(/Next Step/).disabled).toBeTruthy();
  });

  it('returns errors to clients when the weight input is invalid', async () => {
    axios.get.mockReturnValue(Promise.resolve(response));
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
    axios.get.mockReturnValue(Promise.resolve(response));
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

  it('renders without throwing errors', async () => {
    axios.get.mockReturnValue(Promise.resolve(response));
    const app = render(<App />);
    await waitFor(() => app.getByTestId('app'));
    expect(axios.get).toHaveBeenCalledWith(
        'http://test:8000/api/sample');
  });

  it('will update the weights correctly with input', async () => {
    axios.get.mockReturnValue(Promise.resolve(response));
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

  it('will update the shown portfolio with button click', async () => {
    axios.get.mockReturnValue(Promise.resolve(response));
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

    expect(app.getByTestId('forty-portfoliovalue').textContent).toBe('110.00');
  });

  it('will update the period counter with button click', async () => {
    axios.get.mockReturnValue(Promise.resolve(response));
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

    expect(app.getByTestId('forty-portfolioperiod').textContent).toBe('1');
  });

  it('has correct # of inputs for the number of assets', async () => {
    const response = {
      data: {
        data: [
          {
            period: 'Fake',
            data: [
              0.1,
              0.1,
              0.1,
            ],
          }, {
            period: 'Fake',
            data: [
              0.1,
              0.1,
              0.1,
            ],
          },
        ],
      },
    };

    axios.get.mockReturnValue(Promise.resolve(response));
    const app = render(<App />);
    await waitFor(() => app.getByLabelText('weight-input-0'));

    expect(app.queryAllByLabelText(/weight-input.*/)).toHaveLength(2);
  });
});
