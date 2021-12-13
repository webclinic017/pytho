import {
  axisBuilder,
} from '../../axis';
import {
  lineBuilder,
} from '../../element';
import {
  brushBuilder,
} from '../../brush';
import {
  timeButtonUpdater,
} from '../../timebuttons';

export const brushChartBuilder = (context) => {
  const modContext = {
    ...context,
    size: {
      ...context.size,
      height: 80,
    },
  };

  const state = {
    context: modContext,
    brush: undefined,
    axis: undefined,
    axisName: 'chart-brush-axis',
    line: undefined,
    root: 'chart-brush',
    hasY: false,
    yAxisMarginAdj: true,
    timeAxis: true,
  };

  /* Binding at a later stage because we need
   * data in the axis at init
   */
  const chartState = {
    axis: axisBuilder(state),
    line: lineBuilder(state),
    brush: brushBuilder(state),
  };

  const init = (xValues, yValues) => {
    // These operations need to be ordered
    chartState.axis = chartState.axis(xValues, yValues);
    chartState.brush = chartState.brush();
    chartState.brush('build')();

    chartState.line = chartState.line();
    chartState.axis('build')();
    chartState.line('build')(xValues, yValues);
  };

  const mover = (xValues, yValues, newSelection) => {
    const selection = newSelection.map(state.axis[0]);
    chartState.brush('move')(selection);
  };

  const timeUpdater = (xValues, yValues, labels, period) => {
    const {
      newSelection,
    } = timeButtonUpdater(period, xValues, yValues, state);
    mover(xValues, yValues, newSelection);
  };

  return {
    init,
    mover,
    timeUpdater,
  };
};

