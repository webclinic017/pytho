import {
  timeButtonUpdater,
  addButtonHook,
} from '../../timebuttons/';
import {
  axisBuilder,
} from '../../axis';
import {
  lineBuilder,
} from '../../element';
import {
  buildReturn,
  updateReturn,
} from '../../return';

export const lineChartBuilder = (context) => {
  const state = {
    context,
    hasY: true,
    yAxisMarginAdj: false,
    timeAxis: true,
    axis: undefined,
    axisName: undefined,
    line: undefined,
    returnText: undefined,
    root: '#chart-wrapper',
    axisName: 'chart-axis',
  };

  const otherFuncs = {
    buildReturn: buildReturn(state),
    addButtonHook: addButtonHook(state),
    updateReturn: updateReturn(state),
  };

  /* Binding at a later stage because we need
   * data in the axis at init
   */
  const chartState = {
    axis: axisBuilder(state),
    line: lineBuilder(state),
  };

  const init = (data) => {
    otherFuncs.addButtonHook();
    otherFuncs.buildReturn(data);
    chartState.axis(data)('build')();
    chartState.line()('build')(data);
  };

  const updater = (data, xValues) => {
    const {
      xGetter,
    } = state.context;

    const filteredData = data.filter((v) =>
      xGetter(v) > xValues[0] && xGetter(v) < xValues[1]);

    chartState.axis(data)('update')(filteredData, [
      xGetter(data[0]), xGetter(data[data.length - 1]),
    ]);
    const selection = xValues.map(state.axis[0]);
    chartState.axis(data)('update')(filteredData, xValues);
    chartState.line()('update')(filteredData);
    otherFuncs.updateReturn(filteredData);
    return selection;
  };

  const timeUpdater = (data, period) => {
    const {
      xValues,
    } = timeButtonUpdater(period, data, state);
    updater(data, xValues);
  };

  return {
    init,
    updater,
    timeUpdater,
  };
};


