import React from 'react';

import {
  ChartContainer,
} from './components/container';
import {
  LineChart as LineChartInner,
  LineChartWithBrush as LineChartWithBrushInner,
} from './components/line';
import {
  PieChart as PieChartInner
} from './components/pie';
import {
  stockPriceConstantsBuilder,
  backTestResultsConstantsBuilder,
  pieChartConstantsBuilder,
} from './helpers/constants.config.js';

export const TestChart = (props) => {
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
        { ...props }
        constantsBuilder={ stockPriceConstantsBuilder }
        size={ size } />
    </ChartContainer>
  );
};

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
        { ...props }
        constantsBuilder={ backTestResultsConstantsBuilder }
        size={ size } />
    </ChartContainer>
  );
};

export const LineChartWithBrush = (props) => {
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
      <LineChartWithBrushInner
        { ...props }
        constantsBuilder={ backTestResultsConstantsBuilder }
        size={ size } />
    </ChartContainer>
  );
};

export const PieChart = (props) => {
  const size = {
    margin: {
      top: 10,
      right: 30,
      bottom: 30,
      left: 60,
    },
    width: 800,
    height: 200,
  };

  return (
    <ChartContainer>
      <PieChartInner
        { ...props }
        constantsBuilder={ pieChartConstantsBuilder }
        size={ size } />
    </ChartContainer>
  );
}
