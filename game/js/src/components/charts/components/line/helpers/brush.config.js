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
  timeButtonUpdater
} from '../../timebuttons';

export const brushChartBuilder = (context) => {

  const modContext = {
    ...context,
    size: {
      ...context.size,
      height: 100,
    },
  }

  const state = {
    context: modContext,
    brush: undefined,
    axis: undefined,
    axisName: 'chart-brush-axis',
    line: undefined,
    root: '#chart-brush',
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

  const init = (data) => {
    //These operations need to be ordered
    chartState.axis = chartState.axis(data)
    chartState.brush = chartState.brush()
    chartState.brush('build')();

    chartState.line = chartState.line()
    chartState.axis('build')();
    chartState.line('build')(data);
  };

  const mover = (data, xValues) => {
    const selection = xValues.map(state.axis[0]);
    chartState.brush('move')(selection);
  };

  const timeUpdater = (data, period) => {
    const {
      xValues,
    } = timeButtonUpdater(period, data, state);
    mover(data, xValues)
  }

  return {
    init,
    mover,
    timeUpdater
  };
};

