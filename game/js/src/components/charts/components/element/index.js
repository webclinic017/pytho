import {
  select,
  selectAll,
} from 'd3-selection';
import {
  line,
  arc,
  pie,
} from 'd3-shape';

const buildLine = (chartState) => (xValues, yValues) => {
  select(`#${chartState.root}`)
      .append('g')
      .attr('class', 'chart-lines')
      .selectAll('path')
      .data(yValues)
      .join('path')
      .attr('class', 'chart-line')
      .attr('fill', 'none')
      .attr('stroke', (d, i) =>
        chartState.context.colours[i%chartState.context.colours.length])
      .attr('stroke-width', 1.5)
      .attr('d', chartState.line);
};

const updateLine = (chartState) => (yValues) => {
  select(`#${chartState.root}`)
      .selectAll('.chart-line')
      .data(yValues)
      .attr('d', chartState.line);
};

export const lineBuilder = (chartState) => (xValues) => {
  const {
    xGetter,
    yGetter,
  } = chartState.context;
  const [
    x, y,
  ] = chartState.axis;

  const dLine = line()
      .x((d, i)=> x(xGetter(xValues[i])))
      .y((d) => y(yGetter(d)));
  chartState.line = dLine;
  return (action) =>
    action == 'build' ?
    buildLine(chartState) :
    updateLine(chartState);
};

const updateArc = (chartState) => () => {
  select(`#${chartState.root}`)
      .selectAll('g.slice')
      .remove();

  select(`#${chartState.root}`)
      .selectAll('g.slice')
      .data(chartState.pie)
      .enter()
      .append('svg:g')
      .attr('class', 'slice')
      .append('svg:path')
      .attr('fill', (d, i) => chartState.context.colour[i])
      .attr('d', chartState.arc);
};

const buildArc = (chartState) => () => {
  select(`#${chartState.root}`)
      .attr('transform', 'translate(150,100)')
      .selectAll('g.slice')
      .data(chartState.pie)
      .enter()
      .append('svg:g')
      .attr('class', 'slice')
      .append('svg:path')
      .attr('fill', (d, i) => chartState.context.colour[i])
      .attr('d', chartState.arc);
};

export const arcBuilder = (chartState) => () => {
  const {
    radius,
  } = chartState.context;

  const carc = arc()
      .innerRadius(0)
      .outerRadius(radius);

  chartState.arc = carc;
  return (action) =>
    action == 'build' ?
      buildArc(chartState) :
      updateArc(chartState);
};

const buildPie = (chartState) => (data) => {
  const {
    valueGetter,
  } = chartState.context;
  chartState.pie = chartState.pie(data.map(valueGetter));
};

const updatePie = (chartState) => (data) => {
  const {
    valueGetter,
  } = chartState.context;
  chartState.pie = chartState.pie(data.map(valueGetter));
};

export const pieBuilder = (chartState) => () => {
  const cpie = pie();
  chartState.pie = cpie;
  return (action) =>
    action == 'build' ?
      buildPie(chartState) :
      updatePie(chartState);
};

const buildPieText = (chartState) => (data) => {
  select(`#${chartState.root}`)
      .append('g')
      .attr('class', 'piechart-text')
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .text(chartState.context.textBuilder)
      .attr('x', chartState.context.xPos)
      .attr('y', chartState.context.yPos)
      .attr('style', 'font-size: 0.5rem')
      .attr('fill', 'var(--default-text-color)')
      .attr('dy', '.25em');

  select(`#${chartState.root}`)
      .select('.piechart-text')
      .selectAll('rect.piechart-text-color')
      .data(data)
      .enter()
      .append('rect')
      .attr('fill', (d, i) => chartState.context.colour[i])
      .attr('x', chartState.context.rectXPos)
      .attr('y', chartState.context.rectYPos)
      .attr('width', 10)
      .attr('height', 10);
};

const updatePieText = (chartState) => (data) => {
  select(`#${chartState.root}`)
      .selectAll('.piechart-text')
      .remove();

  select(`#${chartState.root}`)
      .append('g')
      .attr('class', 'piechart-text')
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .text(chartState.context.textBuilder)
      .attr('x', chartState.context.xPos)
      .attr('y', chartState.context.yPos)
      .attr('style', 'font-size: 0.5rem')
      .attr('fill', 'var(--default-text-color)')
      .attr('dy', '.25em');

  select(`#${chartState.root}`)
      .select('.piechart-text')
      .selectAll('rect.piechart-text-color')
      .data(data)
      .enter()
      .append('rect')
      .attr('fill', (d, i) => chartState.context.colour[i])
      .attr('x', chartState.context.rectXPos)
      .attr('y', chartState.context.rectYPos)
      .attr('width', 10)
      .attr('height', 10);
};

export const pieTextBuilder = (chartState) => () => {
  return (action) =>
    action == 'build' ?
      buildPieText(chartState) :
      updatePieText(chartState);
};
