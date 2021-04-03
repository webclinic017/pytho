import {
  select,
} from 'd3-selection';

const returnCalculator = (data, yGetter) => {
  const result = (yGetter(data[data.length - 1]) / yGetter(data[0])) - 1;
  return parseFloat(result*100).toFixed(2);
};

export const buildReturn = (chartState) => (data) => {
  const {
    yGetter,
  } = chartState.context;

  const periodReturn = returnCalculator(data, yGetter);

  select(chartState.root)
      .append('text')
      .attr('id', 'chart-periodperf')
      .attr('x', 10)
      .attr('y', 15)
      .attr('style', 'font-size: 0.8rem')
      .attr('fill', 'var(--default-text-color)')
      .attr('dy', '.15em')
      .text((d) => `Period return: ${periodReturn}%`);
};

export const updateReturn = (chartState) => (data) => {
  const {
    yGetter,
  } = chartState.context;

  const periodReturn = returnCalculator(
      data,
      yGetter);

  select('#chart-periodperf')
      .text((d) => `Period return: ${periodReturn}%`);
};

