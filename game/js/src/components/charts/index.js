import React, { useReducer, createRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { timeParse } from 'd3-time-format';
import { select } from 'd3-selection';

import { writeGraph, reducer, init } from './components/reducers/line'
import { writeGraph as writeBrushGraph, reducer as brushReducer, init as brushInit } from './components/reducers/brush'
import { TimeButtons } from './components/timebuttons';

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
  rootId: PropTypes.string.isRequired,
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
      xGetter: (d) => tParser(d),
      yGetter: (d) => d,
      labels,
    },
  };

  const [
    state, dispatch,
  ] = useReducer(
      brushReducer, initState, brushInit,
  );

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
  rootId: PropTypes.string.isRequired,
};