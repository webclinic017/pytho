import React from 'react';
import {
  render,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import axios from 'axios';

jest.mock('axios');

import {
  HermesApp as App,
} from '../index.js';

describe('Testing the functionality of Portfolio Share', () => {
  it('has inputs to input allocation and weight', async () => {
    const app = render(<App />);
    await waitFor(() => app.getByLabelText('security-input'));
    await waitFor(() => app.getByLabelText('weight-input'));

    const securityInput = app.getByLabelText('security-input');
    const weightInput = app.getByLabelText('weight-input');

    fireEvent.change(
        securityInput, {
          target: {
            value: 'Test',
          },
        });
    expect(securityInput.value).toBe('Test');

    fireEvent.change(
        weightInput, {
          target: {
            value: '20',
          },
        });
    expect(weightInput.value).toBe('20');
  });

  it('updates chart and info panel on input', async () => {
    const app = render(<App />);
    await waitFor(() => app.getByLabelText('security-input'));
    await waitFor(() => app.getByLabelText('weight-input'));

    const securityInput = app.getByLabelText('security-input');
    const weightInput = app.getByLabelText('weight-input');

    fireEvent.change(
        securityInput, {
          target: {
            value: 'Test Security',
          },
        });
    fireEvent.change(
        weightInput, {
          target: {
            value: '200',
          },
        });

    const leftClick = {
      button: 1,
    };
    fireEvent.click(
        app.getByTestId('portfolioshare-add'), leftClick);

    expect(app.getAllByText(/Test Security/)).toHaveLength(1);
    expect(app.getAllByText(/200/)).toHaveLength(1);
  });

  it('removes from chart and info panel on remove', async () => {
    const app = render(<App />);
    await waitFor(() => app.getByLabelText('security-input'));
    await waitFor(() => app.getByLabelText('weight-input'));

    const securityInput = app.getByLabelText('security-input');
    const weightInput = app.getByLabelText('weight-input');

    fireEvent.change(
        securityInput, {
          target: {
            value: 'Test Security',
          },
        });
    fireEvent.change(
        weightInput, {
          target: {
            value: '200',
          },
        });

    const leftClick = {
      button: 1,
    };
    fireEvent.click(
        app.getByTestId('portfolioshare-add'), leftClick);

    fireEvent.click(
        app.getByTestId('portfolioshare-remove'), leftClick);

    expect(app.queryByText(/Test Security/)).toBeNull();
    expect(app.queryByText(/200/)).toBeNull();
  });

  it('calls post wit params to build img, returns link ', async () => {
    axios.post.mockReturnValue(Promise.resolve({
      data: {
        link: 'fakelink',
      },
    }));

    const app = render(<App />);
    await waitFor(() => app.getByLabelText('security-input'));
    await waitFor(() => app.getByLabelText('weight-input'));

    const securityInput = app.getByLabelText('security-input');
    const weightInput = app.getByLabelText('weight-input');

    fireEvent.change(
        securityInput, {
          target: {
            value: 'Test Security',
          },
        });
    fireEvent.change(
        weightInput, {
          target: {
            value: '200',
          },
        });

    const leftClick = {
      button: 1,
    };
    fireEvent.click(
        app.getByTestId('portfolioshare-add'), leftClick);

    fireEvent.click(
        app.getByText(/Build Link/), leftClick);

    await waitFor(() => app.queryByTestId('portfolioshare-imagelink'));
    expect(app.queryByTestId('portfolioshare-imagelink').getAttribute('href')).toBe('http://test:8000/static/images/fakelink.jpeg');
    expect(axios.post).toHaveBeenCalled();
  });
});
