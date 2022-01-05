import React, {
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
  TimeButtons,
} from '../timebuttons';
import {
  init, reducer, writeGraph,
} from '../reducers/line';
import {
  init as brushInit, reducer as brushReducer, useBrushChart, writeGraph as writeBrushGraph,
} from '../reducers/brush';

export const LineChart = ({
  xValues, yValues, labels, rootId,
}) => {
  const tParser = timeParse('%s');
  const initState = {
    ref: createRef(),
    rootId,
    data: {
      x: xValues,
      y: yValues,
      xGetter: (d) => tParser(d),
      yGetter: (d) => d,
      labels,
    },
  };

  const [
    state, dispatch,
  ] = useReducer(
      reducer, initState, init,
  );

  const {
    size: {
      width,
      height,
      margin,
    },
    ref,
    root,
    rootWrapper,
  } = state.invariants;

  useEffect(() => {
    select(ref.current)
        .append('svg')
        .attr('id', root)
        .attr('viewBox', [
          0,
          0,
          width+margin.left+margin.right,
          height+margin.top+margin.bottom,
        ])
        .append('g')
        .attr('id', rootWrapper)
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    writeGraph(state, dispatch);
  }, [
  ]);

  return (
    <>
      <div
        ref={ ref } />
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
  const {
    state, dispatch
  } = useBrushChart();

  const {
    ref,
    size: {
      width,
      height,
      margin,
    },
    root,
    rootWrapper,
  } = state.invariants;

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
        .attr('id', `${rootWrapper}`)
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    writeBrushGraph(state, dispatch);
  }, [
  ]);

  return (
    <>
      <TimeButtons />
      <div
        ref={ ref } />
    </>
  );
};

LineChartWithBrush.propTypes = {
  xValues: PropTypes.array.isRequired,
  yValues: PropTypes.array.isRequired,
  labels: PropTypes.arrayOf(PropTypes.string),
};
