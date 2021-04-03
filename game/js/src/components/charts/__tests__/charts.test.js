import React from 'react';
import {
  render,
} from '@testing-library/react';

import {
  TestChart,
} from '../';
import {
  data,
} from '../__mock__/data.js';

describe('Testing the functionality of the charts components', () => {
  it('can render without error', () => {
    const App = (props) => {
      return (
        <TestChart
          data={ data } />
      );
    };

    const app = render(<App />);
    expect(app).toBeTruthy();
  });
});
