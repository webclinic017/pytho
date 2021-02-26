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

  const mainAxis = mainFuncs.axisBuilder();
  const mainLine = mainFuncs.lineBuilder();
  const brushAxis = brushFuncs.axisBuilder();
  const brushLine = brushFuncs.lineBuilder();
  const brush = brushFuncs.brushBuilder();

  const dispatchers = {
    'start': () => {
      mainFuncs.addButtonHook();
      mainFuncs.buildReturn();
      mainLine('build')();
      mainAxis('build')();
      brush('build')();
      brushAxis('build')();
      brushLine('build')();
    },
    'brush': (selection) => {
      mainAxis('update')(selection)
      mainLine('update')();
      mainFuncs.updateReturn();
    },
    'timebutton': (period) => {
      const positions = brushFuncs.timeButtonUpdater(period);
      dispatcher.call('brush', undefined, positions);
      brush('move')(positions);
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
