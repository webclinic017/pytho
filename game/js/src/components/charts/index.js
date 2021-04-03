import React from 'react';
import PropTypes from 'prop-types';

import {
  ChartContainer,
} from './components/container';
import {
  LineChartWithBrush as LineChartWithBrushInner,
} from './components/line';
import {
  PieChart as PieChartInner,
} from './components/pie';
import {
  stockPriceConstantsBuilder,
  backTestResultsConstantsBuilder,
  pieChartConstantsBuilder,
} from './helpers/constants.config.js';
import {
  pieChartBuilder,
} from './components/pie/helpers/pie.config.js';
import {
  lineChartBuilder,
} from './components/line/helpers/line.config.js';
import {
  brushChartBuilder,
} from './components/line/helpers/brush.config.js';

export const TestChart = ({
  data,
}) => {
  return (
    <ChartContainer
      stateBuilders={
        [
          lineChartBuilder, brushChartBuilder,
        ]
      }
      constantsBuilder={ stockPriceConstantsBuilder }>
      <LineChartWithBrushInner
        data={ data } />
    </ChartContainer>
  );
};

TestChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export const LineChartWithBrush = ({
  data,
}) => {
  return (
    <ChartContainer
      stateBuilders={
        [
          lineChartBuilder, brushChartBuilder,
        ]
      }
      constantsBuilder={ backTestResultsConstantsBuilder }>
      <LineChartWithBrushInner
        data={ data } />
    </ChartContainer>
  );
};

LineChartWithBrush.propTypes = {
  data: PropTypes.array.isRequired,
};

export const PieChart = ({
  data,
}) => {
  return (
    <ChartContainer
      stateBuilder={ pieChartBuilder }
      constantsBuilder={ pieChartConstantsBuilder }>
      <PieChartInner
        data={ data } />
    </ChartContainer>
  );
};

PieChart.propTypes = {
  data: PropTypes.array.isRequired,
};

