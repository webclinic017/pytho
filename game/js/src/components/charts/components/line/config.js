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
  min,
  max,
} from 'd3-array';

import {
  addButtonHook,
} from '../timebuttons/';

const brushStateBuilder = (size) => ({
  config: {
    hasY: false,
    yAxisMarginAdj: true,
    timeAxis: true,
    size: {
      ...size,
      height: 100,
    },
  },
  brush: undefined,
  axis: undefined,
  axisName: undefined,
  line: undefined,
  root: '#chart-brush',
});

const chartStateBuilder = (data, size) => ({
  config: {
    hasY: true,
    yAxisMarginAdj: false,
    timeAxis: true,
    size,
  },
  chartData: data,
  axis: undefined,
  axisName: undefined,
  line: undefined,
  returnText: undefined,
  root: '#chart-wrapper',
});

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

export const constantsBuilder = (data, context) => {
  return {
    root: undefined,
    data: data,
    tParser: timeParse('%d/%m/%Y'),
    dispatcher: dispatch('start', 'brush', 'timebutton'),
    ...context,
  };
};

export const brushChartBuilder = (constants, size) => {
  const state = {
    brushComponents: brushStateBuilder(size),
    constants,
  };

  const timeButtonUpdater = (period) => {
    const {
      tParser,
      data,
    } = constants;

    const monthlyTradingDays = 21;
    const lastNDays = (days) =>
      data.slice(Math.max(data.length - days, 1));

    let filteredData = [
    ];
    let value = [
    ];
    if (period == '1m') {
      filteredData = lastNDays(monthlyTradingDays);
      value = [
        filteredData[0].date, filteredData[filteredData.length -1].date,
      ].map((v) => tParser(v));
    } else if (period == '3m') {
      filteredData = lastNDays(monthlyTradingDays*3);
      value = [
        filteredData[0].date, filteredData[filteredData.length -1].date,
      ].map((v) => tParser(v));
    } else if (period == '6m') {
      filteredData = lastNDays(monthlyTradingDays*6);
      value = [
        filteredData[0].date, filteredData[filteredData.length -1].date,
      ].map((v) => tParser(v));
    } else if (period == '12m') {
      filteredData = lastNDays(monthlyTradingDays*12);
      value = [
        filteredData[0].date, filteredData[filteredData.length -1].date,
      ].map((v) => tParser(v));
    } else if (period == 'Max') {
      filteredData = data;
      value = [
        filteredData[0].date, filteredData[filteredData.length -1].date,
      ].map((v) => tParser(v));
    }

    return value.map(brushComponents.axis[0]);
  };

  const {
    brushComponents,
  } = state;

  const funcs = {
    axisBuilder: axisBuilder(brushComponents, constants, 'chart-brush'),
    lineBuilder: lineBuilder(brushComponents, constants),
    buildAxis: buildAxis(brushComponents, constants),
    buildLine: buildLine(brushComponents, constants),
    updateAxis: updateAxis(brushComponents),
    moveBrush: moveBrush(brushComponents),
    brushBuilder: brushBuilder(brushComponents, constants),
    buildBrush: buildBrush(brushComponents, constants),
    timeButtonUpdater,
  };

  return {
    brushState: state,
    brushFuncs: funcs,
  };
};

export const mainChartBuilder = (constants, size) => {
  const dataCopy = [
    ...constants.data,
  ];
  const state = {
    constants,
    chartComponents: chartStateBuilder(dataCopy, size),
  };

  const dataUpdater = (selection) => {
    const {
      chartComponents,
    } = state;
    const {
      axis,
    } = chartComponents;
    const {
      data,
      tParser,
    } = constants;

    const value = selection
        .map(axis[0].invert, axis[0])
        .map(utcDay.round);
    axis[0].domain(value);
    const filteredData = data.filter((d) =>
      tParser(d.date) >= value[0] &&
        tParser(d.date) <= value[1]);
    axis[1].domain([
      min(filteredData, (d) => d.close), max(filteredData, (d) => d.close),
    ]);
    chartComponents.chartData = filteredData;
  };

  const {
    chartComponents,
  } = state;

  const funcs = {
    axisBuilder: axisBuilder(chartComponents, constants, 'chart'),
    lineBuilder: lineBuilder(chartComponents, constants),
    buildAxis: buildAxis(chartComponents, constants),
    buildLine: buildLine(chartComponents, constants),
    buildReturn: buildReturn(chartComponents, constants),
    updateAxis: updateAxis(chartComponents),
    addButtonHook: addButtonHook(constants),
    updateData: dataUpdater,
    updateReturn: updateReturn(chartComponents),
    updateLine: updateLine(chartComponents),
  };

  return {
    mainState: state,
    mainFuncs: funcs,
  };
};


