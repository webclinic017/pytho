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
  legendBuilder,
} from '../../legend';
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
    root: `${context.root}-chart-wrapper`,
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
    legend: legendBuilder(state),
  };

  const init = (xValues, yValues, labels) => {
    otherFuncs.addButtonHook();
    if (context.hasReturnText) {
      otherFuncs.buildReturn(xValues, yValues);
    }
    chartState.axis(xValues, yValues)('build')();
    chartState.line(xValues)('build')(xValues, yValues);
    if (labels) {
      chartState.legend()('build')(labels);
    }
  };

  const updater = (xValues, yValues, labels, newSelection) => {
    const {
      xGetter,
    } = state.context;

    //There is no better way to do this but this binds us
    //to xValues that are dates
    const positions = [
      xValues.findIndex(d => xGetter(d).getTime() >= newSelection[0].getTime()),
      xValues.findIndex(d => xGetter(d).getTime() >= newSelection[1].getTime())
   ]

    const filteredXValues = xValues.slice(positions[0], positions[1])
    const filteredYValues = yValues.map(row => row.slice(positions[0], positions[1]))

    chartState.axis(xValues, yValues)('update')(filteredXValues, filteredYValues);
    chartState.line(filteredXValues)('update')(filteredYValues);
    if (context.hasReturnText) {
      otherFuncs.updateReturn(filteredYValues);
    }
    const selection = newSelection.map(state.axis[0])
    return selection;
  };

  const timeUpdater = (xValues, yValues, labels, period) => {
    const {
      newSelection,
    } = timeButtonUpdater(period, xValues, yValues, state);
    updater(xValues, yValues, labels, newSelection);
  };

  return {
    init,
    updater,
    timeUpdater,
  };
};


