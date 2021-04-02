import {
  pieBuilder,
  arcBuilder,
  pieTextBuilder,
} from '../../element';

export const pieChartBuilder = (context) => {
  const state = {
    arc: undefined,
    pie: undefined,
    pieText: undefined,
    context,
  };

  const builderFuncs = {
    pie: pieBuilder(state)(),
    arc: arcBuilder(state)(),
    pieText: pieTextBuilder(state)(),
  };

  const init = (data) => {
    builderFuncs.pie('build')(data);
    builderFuncs.arc('build')();
    builderFuncs.pieText('build')(data);
  };

  const changed = (data) => {
    builderFuncs.pie('update')(data);
    builderFuncs.arc('update')();
    builderFuncs.pieText('update')(data);
  };

  return {
    init,
    changed,
  };
};
