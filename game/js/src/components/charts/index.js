import React from 'react';
import PropTypes from 'prop-types';

import {
  ChartContainer,
} from './components/container';
import {
  LineChart as LineChartInner,
  LineChartWithBrush as LineChartWithBrushInner,
} from './components/line';
import {
  PieChart as PieChartInner,
} from './components/pie';
import {
  stockPriceConstantsBuilder,
  backTestResultsConstantsBuilder,
  pieChartConstantsBuilder,
  exposureAnalysisAlphaConstantsBuilder,
  exposureAnalysisCoefsConstantsBuilder,
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
  const xValues = data.map((d) => d.date);
  const yValues = [
    data.map((d) => d.close),
  ];
  return (
    <ChartContainer
      stateBuilders={
        [
          lineChartBuilder, brushChartBuilder,
        ]
      }
      constantsBuilder={ stockPriceConstantsBuilder }>
      <LineChartWithBrushInner
        xValues={ xValues }
        yValues={ yValues } />
    </ChartContainer>
  );
};

TestChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export const ExposureAnalysisCoefsLineChart = ({
  labels,
  xValues,
  yValues,
}) => {
  const rootId = 'chart-container-exposure-coefs'
  return (
    <LineChartInner
      rootId={ rootId }
      labels={ labels }
      xValues={ xValues }
      yValues={ yValues } />
  );
};

ExposureAnalysisCoefsLineChart.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  xValues: PropTypes.array.isRequired,
  yValues: PropTypes.array.isRequired,
};

export const ExposureAnalysisAlphaLineChart = ({
  xValues,
  yValues,
}) => {
  const rootId = 'chart-container-exposure-alpha'
  return (
    <LineChartInner
      rootId={ rootId }
      labels={
        [
          'Alpha',
        ]
      }
      xValues={ xValues }
      yValues={ yValues } />
  );
};

ExposureAnalysisAlphaLineChart.propTypes = {
  xValues: PropTypes.array.isRequired,
  yValues: PropTypes.array.isRequired,
};

export const LineChartWithBrush = ({
  labels,
  xValues,
  yValues,
}) => {
  const rootId = 'chart-container-backtest'
  return (
    <LineChartWithBrushInner
      rootId={ rootId }
      labels={ labels }
      xValues={ xValues }
      yValues={ yValues } />
  );
};

LineChartWithBrush.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  xValues: PropTypes.array.isRequired,
  yValues: PropTypes.array.isRequired,
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

