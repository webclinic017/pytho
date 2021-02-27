import React from 'react';

import {
  ChartContainer,
} from './components/container';
import {
  LineChart as LineChartInner,
} from './components/line';

export const LineChart = (props) => {
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

  return (
    <ChartContainer>
      <LineChartInner
        { ...props } />
    </ChartContainer>
  );
};
