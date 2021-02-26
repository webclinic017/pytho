import React, {
  useContext,
} from 'react';
import PropTypes from 'prop-types';

import {
  ChartContext,
} from '../container';
import {
  BaseChart,
} from '../base';
import {
  TimeButtons,
} from '../timebuttons';
import {
  mainChartBuilder,
  constantsBuilder,
  brushChartBuilder,
} from './config.js';

export const LineChart = ({
  data,
  size,
}) => {
  const context = useContext(ChartContext);
  const constants = constantsBuilder(data, context);
  const {
    mainState, mainFuncs,
  } = mainChartBuilder(constants, size);
  const {
    brushFuncs,
  } = brushChartBuilder(constants, size);

  const {
    dispatcher,
  } = constants;

  const dispatchers = {
    'start': () => {
      mainFuncs.addButtonHook();

      mainFuncs.axisBuilder();
      mainFuncs.lineBuilder();

      mainFuncs.buildAxis();
      mainFuncs.buildLine();
      mainFuncs.buildReturn();

      brushFuncs.axisBuilder();
      brushFuncs.lineBuilder();
      brushFuncs.brushBuilder();

      brushFuncs.buildBrush();
      brushFuncs.buildLine();
      brushFuncs.buildAxis();
    },
    'brush': (selection) => {
      mainFuncs.axisBuilder();

      mainFuncs.updateData(selection);
      mainFuncs.updateAxis();
      mainFuncs.lineBuilder();
      mainFuncs.updateLine();
      mainFuncs.updateReturn();
    },
    'timebutton': (period) => {
      const positions = brushFuncs.timeButtonUpdater(period);
      mainFuncs.axisBuilder(mainState.chartComponents, constants, 'chart');
      dispatcher.call('brush', undefined, positions);

      brushFuncs.moveBrush(positions);
    },
  };

  return (
    <>
      <TimeButtons />
      <BaseChart
        dispatcher={ dispatcher }
        dispatchers={ dispatchers }
        size={ mainState.chartComponents.config.size }
        events={
          [
            'start',
            'brush',
            'timebutton',
          ]
        } />
    </>
  );
};

LineChart.propTypes = {
  data: PropTypes.array.isRequired,
  size: PropTypes.object.isRequired,
};
