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

export const LineChart = ({
  xValues, yValues, labels,
}) => {
  const context = useContext(ChartContext);
  const {
    dispatcher,
  } = context;

  const [
    mainFuncs,
  ] = context.builderFuncs;

  const dispatchers = {
    'start': () => {
      mainFuncs.init(xValues, yValues, labels);
    },
  };

  Object.keys(dispatchers).map((e) => {
    dispatcher.on(e, dispatchers[e]);
  });

  return (
    <>
      <BaseChart />
    </>
  );
};

LineChart.propTypes = {
  xValues: PropTypes.array.isRequired,
  yValues: PropTypes.array.isRequired,
  labels: PropTypes.arrayOf(PropTypes.string),
};

export const LineChartWithBrush = ({
  xValues,
  yValues,
  labels,
}) => {
  const context = useContext(ChartContext);
  const {
    dispatcher,
  } = context;

  const [
    mainFuncs, brushFuncs,
  ] = context.builderFuncs;

  const dispatchers = {
    'start': () => {
      mainFuncs.init(xValues, yValues, labels);
      brushFuncs.init(xValues, yValues);
    },
    'brush': (newSelection) => {
      mainFuncs.updater(xValues, yValues, labels, newSelection);
    },
    'timebutton': (period) => {
      mainFuncs.timeUpdater(xValues, yValues, labels, period);
      brushFuncs.timeUpdater(xValues, yValues, labels, period);
    },
  };

  Object.keys(dispatchers).map((e) => {
    dispatcher.on(e, dispatchers[e]);
  });

  return (
    <>
      <TimeButtons />
      <BaseChart />
    </>
  );
};

LineChartWithBrush.propTypes = {
  xValues: PropTypes.array.isRequired,
  yValues: PropTypes.array.isRequired,
  labels: PropTypes.arrayOf(PropTypes.string),
};
