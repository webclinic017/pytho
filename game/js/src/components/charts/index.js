import React from 'react';

import {
  ChartContainer,
  chartContainerBuilder,
} from './components/container';
import {
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
import {
  pieChartBuilder
} from './components/pie/helpers/pie.config.js';
import {
  lineChartBuilder
} from './components/line/helpers/line.config.js';
import {
  brushChartBuilder
} from './components/line/helpers/brush.config.js';

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
      <LineChartWithBrushInner
        { ...props }
        constantsBuilder={ stockPriceConstantsBuilder }
        size={ size } />
    </ChartContainer>
  );
};

export const LineChartWithBrush = ({data}) => {
  return (
    <ChartContainer
      stateBuilders={[lineChartBuilder, brushChartBuilder]}
      constantsBuilder={backTestResultsConstantsBuilder}>
      <LineChartWithBrushInner
        data={data} />
    </ChartContainer>
  );
};

export const PieChart = ({data}) => {
  return (
    <ChartContainer
      stateBuilder={ pieChartBuilder }
      constantsBuilder= { pieChartConstantsBuilder }>
      <PieChartInner data={data} />
    </ChartContainer>
  );
}
