import React, { useContext } from 'react';

import {
  timeParse,
} from 'd3-time-format'
import {
  dispatch
} from 'd3-dispatch'
import {
  utcDay
} from 'd3-time'

import {
  ChartContext
} from '../container'
import {
  axisBuilder,
  buildAxis,
  updateAxis,
} from '../axis'
import {
  lineBuilder,
  buildLine,
  updateLine,
} from '../element'
import {
  buildReturn,
  updateReturn,
} from '../return'
import {
  brushBuilder,
  buildBrush,
} from '../brush'
import {
  BaseChart
} from '../base'

export const LineChart = (props) => {
  const context = useContext(ChartContext);
  const {
    width,
    height,
    margin,
    ref,
  } = context;
  const {
    data
  } = props;

  const dispatcher = dispatch('start', 'brush');

  const axis = axisBuilder(data, context);
  const dLine = lineBuilder(axis);

  const dispatchers = {
    'start': () => {
      buildAxis('#chart-wrapper', axis, context, 'chart');
      buildLine('#chart-wrapper', dLine, data);
      buildReturn(`#chart-wrapper`, data);

      const brushContext = {
        ...context,
        height: 100,
      };
      const brushAxis = axisBuilder(data, brushContext, true);
      const brushLine = lineBuilder(brushAxis);
      const brush = brushBuilder(axis, brushContext, dispatcher);

      buildBrush(ref.current, brush, axis, brushContext);
      buildLine('#chart-brush', brushLine, data);
      buildAxis('#chart-brush', brushAxis, brushContext, 'chart-brush', false, true);
    },
    'brush': (selection) => {
      const tParser = timeParse('%d/%m/%Y');

      const axis = axisBuilder(data, context);
      const value = selection
          .map(axis[0].invert, axis[0])
          .map(utcDay.round);
      axis[0].domain(value);
      const filteredData = data.filter((d) =>
        tParser(d.date) >= value[0] &&
        tParser(d.date) <= value[1]);

      const periodReturn = (filteredData[filteredData.length - 1].close / filteredData[0].close) - 1;

      updateAxis('#chart', axis, context);

      const dLine = lineBuilder(axis);
      updateLine('#chart-line', dLine, filteredData);
      updateReturn(filteredData);
    },
  };

  return (
    <BaseChart
      dispatcher={ dispatcher }
      dispatchers={ dispatchers }
      events={
        [
          'start', 'brush',
        ]
      } />);
};
