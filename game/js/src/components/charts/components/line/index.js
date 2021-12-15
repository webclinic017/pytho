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
import {
  init as brushInit, reducer as brushReducer, initBrush
} from '../reducers/brush';

export const LineChart = ({
  xValues, yValues, labels, rootId
}) => {

  const tParser = timeParse('%s');
  const initState = {
    ref: createRef(),
    rootId,
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
    rootContainer
  } = state;
  const {
    width,
    height,
    margin,
  } = size;

  useEffect(() => {
    select(ref.current)
      .append('svg')
      .attr('id', `${rootContainer}`)
      .attr('viewBox', [
        0,
        0,
        width+margin.left+margin.right,
        height+margin.top+margin.bottom,
      ])
      .append('g')
      .attr('id', `${rootContainer}-chart-wrapper`)
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
  rootId,
}) => {

  const tParser = timeParse('%s');
  const initState = {
    ref: createRef(),
    rootId,
    data: {
      x: xValues,
      y: yValues,
      xGetter: d => tParser(d),
      yGetter: d => d,
      labels
    }
  }

  const [state, dispatch] = useReducer(
    brushReducer, initState, brushInit 
  )

  const {
    ref,
    size,
    root,
    rootContainer
  } = state;
  const {
    width,
    height,
    margin,
  } = size;

  useEffect(() => {
    select(ref.current)
      .append('svg')
      .attr('id', `${rootContainer}`)
      .attr('viewBox', [
        0,
        0,
        width+margin.left+margin.right,
        height+margin.top+margin.bottom,
      ])
      .append('g')
      .attr('id', `${rootContainer}-chart-wrapper`)
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    initBrush(state, dispatch)()
  }, [
  ]);

  /*
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
  */

  return (
    <>
      <TimeButtons />
      <div ref={ref} />
    </>
  );
};

LineChartWithBrush.propTypes = {
  xValues: PropTypes.array.isRequired,
  yValues: PropTypes.array.isRequired,
  labels: PropTypes.arrayOf(PropTypes.string),
};
