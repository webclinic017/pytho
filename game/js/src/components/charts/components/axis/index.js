import {
  select,
} from 'd3-selection';
import {
  scaleLinear, scaleTime,
} from 'd3-scale';
import {
  axisBottom, axisLeft,
} from 'd3-axis';
import {
  extent, max, min,
} from 'd3-array';
import {
  timeParse,
} from 'd3-time-format';

export const axisBuilder = (data, ctx, yAxisMarginAdj = false) => {
  const tParser = timeParse('%d/%m/%Y');
  const {
    height,
    width,
    margin,
  } = ctx;

  const bottomMargin = yAxisMarginAdj ? height - margin.bottom : height;

  const x = scaleTime()
      .domain(extent(data, (d) => tParser(d.date)))
      .range([
        0, width,
      ]);

  const y = scaleLinear()
      .domain([
        min(data, (d) => d.close), max(data, (d) => d.close),
      ])
      .range([
        bottomMargin, 0,
      ]);

  return [
    x, y,
  ];
};

export const buildAxis = (
    root,
    axis,
    ctx,
    name,
    buildY = true,
    axisMarginAdj = false,
) => {
  const [
    x, y,
  ] = axis;
  const {
    height,
    margin,
  } = ctx;

  const bottomMargin = axisMarginAdj ?
    height - margin.bottom :
    height;

  select(root)
      .append('g')
      .attr('id', `${name}-xaxis`)
      .attr('transform', `translate(0, ${bottomMargin})`)
      .call(axisBottom(x));

  if (buildY) {
    select(root)
        .append('g')
        .attr('id', `${name}-yaxis`)
        .call(axisLeft(y));
  }
};

export const updateAxis = (root, axis, ctx, buildY = true) => {
  const [
    x, y,
  ] = axis;

  select(`${root}-xaxis`)
      .transition()
      .call(axisBottom(x));

  if (buildY) {
    select(`${root}-yaxis`)
        .transition()
        .call(axisLeft(y));
  }
};

