import React from 'react';

import {
  ChartContainer,
} from './components/container';
import {
  LineChart as LineChartInner,
} from './components/line';

export const LineChart = (props) => {
  return (
    <ChartContainer>
      <LineChartInner
        { ...props } />
    </ChartContainer>
  );
};
