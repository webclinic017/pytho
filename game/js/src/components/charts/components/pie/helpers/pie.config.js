import {
  pieBuilder,
  arcBuilder,
} from '../../element';

const pieStateBuilder = (size, data) => ({
  config: {
    size: {
      ...size,
    },
  },
  root: '#chart-wrapper',
  arc: undefined,
  pie: undefined,
});

export const pieChartBuilder = (constants, size) => {

  const state = {
    pieComponents: pieStateBuilder(size),
    constants,
  };

  const {
    pieComponents
  } = state;

  const funcs = {
    pieBuilder: pieBuilder(pieComponents, constants),
    arcBuilder: arcBuilder(pieComponents, constants),
  };

  const chartState = {
    pie: funcs.pieBuilder(),
    arc: funcs.arcBuilder(),
  };

  const init = () => {
    chartState.pie('build')();
    chartState.arc('build')();
  };

  const changed = (data) => {
    /*
     * Difference with lineChart is that we are
     * updating from the outside rather than
     * responding to state modifications within 
     * the chart, so we need to change chart
     * constants.
     */
    
    constants.data = data
    chartState.pie('update')();
    chartState.arc('update')();
  }

  return {
    init,
    changed,
  };
};
