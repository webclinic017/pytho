import {
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

const lineStateBuilder = (data, size) => ({
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

export const lineChartBuilder = (constants, size) => {
  const dataCopy = [
    ...constants.data,
  ];
  const state = {
    constants,
    chartComponents: lineStateBuilder(dataCopy, size),
  };

  const {
    chartComponents,
  } = state;

  const {
    xGetter,
  } = constants;

  const funcs = {
    axisBuilder: axisBuilder(chartComponents, constants, 'chart'),
    lineBuilder: lineBuilder(chartComponents, constants),
    buildReturn: buildReturn(chartComponents, constants),
    addButtonHook: addButtonHook(constants),
    updateReturn: updateReturn(chartComponents, constants),
  };

  const chartState = {
    axis: funcs.axisBuilder(),
    line: funcs.lineBuilder(),
  };

  const init = () => {
    funcs.addButtonHook();
    funcs.buildReturn();
    chartState.axis('build')();
    chartState.line('build')();
  };

  const updater = (xValues) => {
    const filteredData = dataCopy.filter((v) =>
      xGetter(v) > xValues[0] && xGetter(v) < xValues[1]);
    chartComponents.chartData = filteredData;

    chartState.axis('update')([
      xGetter(dataCopy[0]), xGetter(dataCopy[dataCopy.length - 1]),
    ]);
    const selection = xValues.map(chartComponents.axis[0]);
    chartState.axis('update')(xValues);
    chartState.line('update')();
    funcs.updateReturn();
    return selection;
  };

  return {
    init,
    updater,
  };
};


