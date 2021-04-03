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

const buildAxis = ( chartState ) => () => {
  const [
    x, y,
  ] = chartState.axis;
  const {
    hasY,
    axisName,
    yAxisMarginAdj,
  } = chartState;
  const {
    height,
    margin,
  } = chartState.context.size;

  const bottomMargin = yAxisMarginAdj ?
    height - margin.bottom :
    height;

  select(chartState.root)
      .append('g')
      .attr('id', `${axisName}-xaxis`)
      .attr('transform', `translate(0, ${bottomMargin})`)
      .call(axisBottom(x));

  if (hasY) {
    select(chartState.root)
        .append('g')
        .attr('id', `${axisName}-yaxis`)
        .call(axisLeft(y));
  }
};

const updateAxis = (chartState) => (data, selection) => {
  const [
    x, y,
  ] = chartState.axis;
  const {
    axisName,
    hasY,
  } = chartState;
  const {
    yGetter,
  } = chartState.context;

  x.domain(selection);
  y.domain([
    min(data, yGetter), max(data, yGetter),
  ]);

  select(`#${axisName}-xaxis`)
      .call(axisBottom(x));

  if (hasY) {
    select(`#${axisName}-yaxis`)
        .call(axisLeft(y));
  }
};

export const axisBuilder = ( chartState ) => (data) => {
  const {
    yAxisMarginAdj,
  } = chartState;
  const {
    xGetter,
    yGetter,
    size,
  } = chartState.context;
  const {
    height,
    width,
    margin,
  } = size;

  const bottomMargin = yAxisMarginAdj ?
  height - margin.bottom :
  height;

  const x = scaleTime()
      .domain(extent(data, xGetter))
      .range([
        0, width,
      ]);

  const y = scaleLinear()
      .domain([
        min(data, yGetter), max(data, yGetter),
      ])
      .range([
        bottomMargin, 0,
      ]);

  chartState.axis = [
    x, y,
  ];
  return (action) =>
    action == 'build' ?
      buildAxis(chartState) :
      updateAxis(chartState);
};

