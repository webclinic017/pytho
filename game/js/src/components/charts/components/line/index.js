import React, {
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import {
  timeParse,
} from 'd3-time-format';
import {
  dispatch,
} from 'd3-dispatch';
import {
  utcDay,
} from 'd3-time';
import {
  select
} from 'd3-selection';
import {
  min,
  max
} from 'd3-array';

import {
  ChartContext,
} from '../container';
import {
  axisBuilder,
  buildAxis,
  updateAxis,
} from '../axis';
import {
  lineBuilder,
  buildLine,
  updateLine,
} from '../element';
import {
  buildReturn,
  updateReturn,
} from '../return';
import {
  brushBuilder,
  buildBrush,
  moveBrush,
} from '../brush';
import {
  BaseChart,
} from '../base';
import {
  addButtonHook,
  TimeButtons,
} from '../timebuttons';

export const LineChart = (props) => {
  const context = useContext(ChartContext);
  const {
    ref,
  } = context;
  const {
    data,
  } = props;

  const dispatcher = dispatch('start', 'brush', 'timebutton');

  const axis = axisBuilder(data, context);
  const dLine = lineBuilder(axis);

  const dispatchers = {
    'start': () => {
      addButtonHook(dispatcher)

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
      buildAxis(
          '#chart-brush',
          brushAxis,
          brushContext,
          'chart-brush',
          false,
          true,
      );

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
      axis[1].domain([
        min(filteredData, d => d.close),
        max(filteredData, d => d.close)
      ])
      updateAxis('#chart', axis, context);

      const dLine = lineBuilder(axis);
      updateLine('#chart-line', dLine, filteredData);
      updateReturn(filteredData);
    },
    'timebutton': (period) => {
      const tParser = timeParse('%d/%m/%Y');

      const monthlyTradingDays = 21
      const lastNDays = days =>
        data.slice(Math.max(data.length - days, 1))

      let filteredData = []
      let value = []
      if (period == "1m"){
        filteredData = lastNDays(monthlyTradingDays)
        value = [
          filteredData[0].date, 
          filteredData[filteredData.length -1].date
        ].map(v => tParser(v))
      } else if (period == "3m") {
        filteredData = lastNDays(monthlyTradingDays*3)
        value = [
          filteredData[0].date, 
          filteredData[filteredData.length -1].date
        ].map(v => tParser(v))
      } else if (period == "6m") {
        filteredData = lastNDays(monthlyTradingDays*6)
        value = [
          filteredData[0].date, 
          filteredData[filteredData.length -1].date
        ].map(v => tParser(v))
      } else if (period == "12m") {
        filteredData = lastNDays(monthlyTradingDays*12)
        value = [
          filteredData[0].date, 
          filteredData[filteredData.length -1].date
        ].map(v => tParser(v))
      } else if (period == "Max") {
        filteredData = data
        value = [
          filteredData[0].date, 
          filteredData[filteredData.length -1].date
        ].map(v => tParser(v))
      }

      const axis = axisBuilder(data, context);
      const positions = value.map(axis[0])
      dispatcher.call('brush', undefined, positions);
      const brushContext = {
        ...context,
        height: 100,
      };
      const brush = brushBuilder(axis, brushContext, dispatcher);
      moveBrush(positions, brush)
    },
  };

  return (
    <React.Fragment>
      <TimeButtons />
      <BaseChart
        dispatcher={ dispatcher }
        dispatchers={ dispatchers }
        events={
          [
            'start', 'brush', 'timebutton'
          ]
        } />
   </React.Fragment>
  )
};

LineChart.propTypes = {
  data: PropTypes.array.isRequired,
};
