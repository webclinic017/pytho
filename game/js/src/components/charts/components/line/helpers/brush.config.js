import {
  axisBuilder,
} from '../../axis';
import {
  lineBuilder,
} from '../../element';
import {
  brushBuilder,
} from '../../brush';

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

export const brushChartBuilder = (constants, size) => {
  const state = {
    brushComponents: brushStateBuilder(size),
    constants,
  };

  const {
    brushComponents,
  } = state;

  const funcs = {
    axisBuilder: axisBuilder(brushComponents, constants, 'chart-brush'),
    lineBuilder: lineBuilder(brushComponents, constants),
    brushBuilder: brushBuilder(brushComponents, constants),
  };

  const chartState = {
    axis: funcs.axisBuilder(),
    line: funcs.lineBuilder(),
    brush: funcs.brushBuilder(),
  };

  const init = () => {
    chartState.brush('build')();
    chartState.axis('build')();
    chartState.line('build')();
  };

  const mover = (xValues) => {
    const selection = xValues.map(brushComponents.axis[0]);
    chartState.brush('move')(selection);
  };

  return {
    brushInit: init,
    brushMover: mover,
  };
};

