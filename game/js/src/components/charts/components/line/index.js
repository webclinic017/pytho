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

export const LineChartWithBrush = ({
  data,
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
      mainFuncs.init(data);
      brushFuncs.init(data);
    },
    'brush': (selection) => {
      mainFuncs.updater(data, selection);
    },
    'timebutton': (period) => {
      mainFuncs.timeUpdater(data, period);
      brushFuncs.timeUpdater(data, period);
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
  data: PropTypes.array.isRequired,
};
