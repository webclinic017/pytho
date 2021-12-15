import React, {
  useContext,
  useEffect,
  useReducer,
  createRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  select,
} from 'd3-selection';
import {
  timeParse,
} from 'd3-time-format';

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
  init, reducer
} from '../reducers/line';

export const LineChart = ({
  xValues, yValues, labels,
}) => {

  const tParser = timeParse('%s');
  const initState = {
    ref: createRef(),
    rootId: 'chart-container-backtest',
    data: {
      x: xValues,
      y: yValues,
      xGetter: d => tParser(d),
      yGetter: d => d,
      labels
    }
  }

  const [state, dispatch] = useReducer(
    reducer, initState, init
  )

  const {
    ref,
    size,
    root,
  } = state;
  const {
    width,
    height,
    margin,
  } = size;

  useEffect(() => {
    select(ref.current)
      .append('svg')
      .attr('id', `${root}`)
      .attr('viewBox', [
        0,
        0,
        width+margin.left+margin.right,
        height+margin.top+margin.bottom,
      ])
      .append('g')
      .attr('id', `${root}-chart-wrapper`)
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    dispatch({type: "init"})
  }, [
  ]);

  return (
    <>
      <div ref={ref} />
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
