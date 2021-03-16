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
  timeButtonUpdater,
  TimeButtons,
} from '../timebuttons';
import {
  lineChartBuilder,
} from './helpers/line.config.js';
import {
  brushChartBuilder,
} from './helpers/brush.config.js';

export const LineChart = ({
  data,
  size,
  constantsBuilder,
}) => {
  const context = useContext(ChartContext);
  const constants = constantsBuilder(data, context);
  const {
    init, updater,
  } = lineChartBuilder(constants, size);

  const {
    dispatcher,
  } = constants;

  const dispatchers = {
    'start': () => {
      init();
    },
    'timebutton': (period) => {
      const {
        xValues,
      } = timeButtonUpdater(period, constants);
      updater(xValues);
    },
  };

  return (
    <>
      <TimeButtons />
      <BaseChart
        dispatcher={ dispatcher }
        dispatchers={ dispatchers }
        size={ size }
        events={
          [
            'start', 'timebutton',
          ]
        } />
    </>
  );
};

LineChart.propTypes = {
  data: PropTypes.array.isRequired,
  size: PropTypes.object.isRequired,
  constantsBuilder: PropTypes.func.isRequired,
};

export const LineChartWithBrush = ({
  data,
  size,
  constantsBuilder,
}) => {
  const context = useContext(ChartContext);
  const constants = constantsBuilder(data, context);
  const {
    init, updater,
  } = lineChartBuilder(constants, size);
  const {
    brushInit, brushMover,
  } = brushChartBuilder(constants, size);

  const {
    dispatcher,
  } = constants;

  const dispatchers = {
    'start': () => {
      init();
      brushInit();
    },
    'brush': (selection) => {
      updater(selection);
    },
    'timebutton': (period) => {
      const {
        xValues,
      } = timeButtonUpdater(period, constants);
      updater(xValues);
      brushMover(xValues);
    },
  };

  return (
    <>
      <TimeButtons />
      <BaseChart
        dispatcher={ dispatcher }
        dispatchers={ dispatchers }
        size={ size }
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

LineChartWithBrush.propTypes = {
  data: PropTypes.array.isRequired,
  size: PropTypes.object.isRequired,
  constantsBuilder: PropTypes.func.isRequired,
};
