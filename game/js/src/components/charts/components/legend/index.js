import {
  select,
} from 'd3-selection';

const tempHardcodedHeight = 20;

const buildLegend = (chartState) => (labels) => {
  const {
    size,
  } = chartState.context;
  const {
    width,
    height,
    margin,
  } = size;

  const startpoint = height+margin.top+margin.bottom+10;
  const labelCount = labels.length;
  const legendHeight = labelCount * tempHardcodedHeight;

  select(`#${chartState.context.root}`)
      .attr('viewBox', [
        0,
        0,
        width+margin.left+margin.right,
        height+margin.top+margin.bottom+legendHeight+20,
      ]);

  select(`#${chartState.root}`)
      .append('g')
      .attr('class', 'chart-legend')
      .selectAll('circle')
      .data(labels)
      .join('circle')
      .attr('cx', 0)
      .attr('cy', (d, i) => startpoint + (i*tempHardcodedHeight))
      .attr('r', 7)
      .style('fill', (d, i) =>
        chartState.context.colours[i%chartState.context.colours.length]);

  select(`#${chartState.root}`)
      .select('.chart-legend')
      .selectAll('text')
      .data(labels)
      .join('text')
      .attr('x', 15)
      .attr('y', (d, i) => startpoint + (i*tempHardcodedHeight) + 4)
      .text((d) => d)
      .attr('fill', 'var(--default-text-color)')
      .attr('font-family', 'var(--default-font)')
      .attr('font-size', '0.8rem')
      .attr('text-anchor', 'left');
};

const updateLegend = (chartState) => (labels) => { };

export const legendBuilder = (chartState) => () => {
  return (action) =>
    action == 'build' ?
    buildLegend(chartState) :
    updateLegend(chartState);
};

