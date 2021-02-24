import React from 'react';
import {
  render,
} from '@testing-library/react';

import {
  LineChart,
} from '../';
import {
  data,
} from '../__mock__/data.js';

describe('Testing the functionality of the charts components', () => {
  it('can render without error', () => {
    const app = render(<LineChart
      data={ data } />);
    expect(app).toBeTruthy();
  });
});
