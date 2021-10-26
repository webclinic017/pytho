import {
  select,
} from 'd3-selection';

const returnCalculator = (data, yGetter) => {
  const result = (yGetter(data[data.length - 1]) / yGetter(data[0])) - 1;
  return parseFloat(result*100).toFixed(2);
};

const tempHardcodedHeight = 20;

export const buildReturn = (chartState) => (xValues, yValues) => {
  const {
    yGetter,
  } = chartState.context;

  const periodReturns = yValues.map((y) => returnCalculator(y, yGetter));

  const startpoint = 15;

  select(`#${chartState.root}`)
      .append('g')
      .attr('class', 'chart-periodperf')
      .selectAll('text')
      .data(periodReturns)
      .join('text')
      .attr('class', 'chart-periodperf-text')
      .attr('x', 30)
      .attr('y', (d, i) => (i * tempHardcodedHeight) + startpoint + 3)
      .attr('fill', 'var(--default-text-color)')
      .attr('font-family', 'var(--default-font)')
      .attr('font-size', '0.8rem')
      .attr('dy', '.15em')
      .text((d) => ` ${d}%`);

  select(`#${chartState.root}`)
      .select('.chart-periodperf')
      .selectAll('circle')
      .data(periodReturns)
      .join('circle')
      .attr('cx', 20)
      .attr('cy', (d, i) => startpoint + (i*tempHardcodedHeight))
      .attr('r', 5)
      .style('fill', (d, i) =>
        chartState.context.colours[i%chartState.context.colours.length]);
};

export const updateReturn = (chartState) => (yValues) => {
  const {
    yGetter,
  } = chartState.context;

  const periodReturns = yValues.map((y) => returnCalculator(y, yGetter));

  select(`#${chartState.root}`)
      .selectAll('.chart-periodperf-text')
      .data(periodReturns)
      .text((d) => ` ${d}%`);
};

