import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import { RiskAttributionApp as App } from '../index.js';

jest.mock('axios');

const response = {
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
        name: 'Random Name',
        issuer: 'Random Issuer',
        currency: 'GBP',
        ticker: null,
        security_type: 'fund',
      },
      {
        id: 14653,
        country_name: 'united kingdom',
        name: 'Random Name',
        issuer: 'Random Issuer',
        currency: 'GBP',
        ticker: null,
        security_type: 'fund',
      },
    ],
  },
};

describe('Testing the functionality of the main app', () => {
  it('can add dependent', async () => {
    axios.get.mockReturnValue(Promise.resolve(response));

    const app = render(<App />);

    const dropId = 'riskattribution-securitytype-dropdown';

    fireEvent.change(app.getByTestId(dropId), { target: { value: 'index' } });

    const securityInput = app.getByPlaceholderText('Search security');
    userEvent.type(securityInput, 'Random');
    expect(securityInput.value).toBe('Random');
    await waitFor(() => app.findAllByText('Random Name'));

    await userEvent.click(app.getAllByText('Random Name')[0]);

    await userEvent.click(app.getByText('Add Dependent'));

    expect(app.getByText('Random Name')).toBeTruthy();
  });

  it('can add independent', async () => {
    axios.get.mockReturnValue(Promise.resolve(response));

    const app = render(<App />);

    const dropId = 'riskattribution-securitytype-dropdown';

    fireEvent.change(app.getByTestId(dropId), { target: { value: 'index' } });

    const securityInput = app.getByPlaceholderText('Search security');
    userEvent.type(securityInput, 'Random');
    expect(securityInput.value).toBe('Random');
    await waitFor(() => app.findAllByText('Random Name'));

    await userEvent.click(app.getAllByText('Random Name')[0]);

    await userEvent.click(app.getByText('Add Independent'));

    expect(app.getByText('Random Name')).toBeTruthy();
  });


  it('can run the model and display the results', async () => {
  });
});
