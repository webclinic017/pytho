import {
  timeParse,
} from 'd3-time-format';
import {
  dispatch,
} from 'd3-dispatch';

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
} from '../axis';
import {
  lineBuilder,
} from '../element';
import {
  buildReturn,
  updateReturn,
} from '../return';
import {
  brushBuilder,
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
    const parseDates = (data) => [
      data[0].date, data[data.length -1].date,
    ];
    if (period == '1m') {
      filteredData = lastNDays(monthlyTradingDays);
      value = parseDates(filteredData).map((v) => tParser(v));
    } else if (period == '3m') {
      filteredData = lastNDays(monthlyTradingDays*3);
      value = parseDates(filteredData).map((v) => tParser(v));
    } else if (period == '6m') {
      filteredData = lastNDays(monthlyTradingDays*6);
      value = parseDates(filteredData).map((v) => tParser(v));
    } else if (period == '12m') {
      filteredData = lastNDays(monthlyTradingDays*12);
      value = parseDates(filteredData).map((v) => tParser(v));
    } else if (period == 'Max') {
      filteredData = data;
      value = parseDates(filteredData).map((v) => tParser(v));
    }
    return value.map(brushComponents.axis[0]);
  };

  const {
    brushComponents,
  } = state;

  const funcs = {
    axisBuilder: axisBuilder(brushComponents, constants, 'chart-brush'),
    lineBuilder: lineBuilder(brushComponents, constants),
    brushBuilder: brushBuilder(brushComponents, constants),
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

  const {
    chartComponents,
  } = state;

  const funcs = {
    axisBuilder: axisBuilder(chartComponents, constants, 'chart'),
    lineBuilder: lineBuilder(chartComponents, constants),
    buildReturn: buildReturn(chartComponents, constants),
    addButtonHook: addButtonHook(constants),
    updateReturn: updateReturn(chartComponents),
  };

  return {
    mainState: state,
    mainFuncs: funcs,
  };
};


