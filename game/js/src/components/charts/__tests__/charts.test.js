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
    const size = {
      margin: {
        top: 10,
        right: 30,
        bottom: 30,
        left: 60,
      },
      width: 800 - 60 - 30,
      height: 400 - 10 - 30,
    };

    const App = (props) => {
      return (
        <TestChart
          size={ size }
          data={ data } />
      );
    };

    const app = render(<App />);
    expect(app).toBeTruthy();
  });
});
