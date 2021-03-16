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

const buildAxis = (
    baseComponents,
) => () => {
  const [
    x, y,
  ] = baseComponents.axis;
  const {
    size,
    hasY,
    yAxisMarginAdj,
  } = baseComponents.config;
  const {
    height,
    margin,
  } = size;

  const bottomMargin = yAxisMarginAdj ?
    height - margin.bottom :
    height;

  select(baseComponents.root)
      .append('g')
      .attr('id', `${baseComponents.axisName}-xaxis`)
      .attr('transform', `translate(0, ${bottomMargin})`)
      .call(axisBottom(x));

  if (hasY) {
    select(baseComponents.root)
        .append('g')
        .attr('id', `${baseComponents.axisName}-yaxis`)
        .call(axisLeft(y));
  }
};

const updateAxis = (baseComponents, constants) => (selection) => {
  const [
    x, y,
  ] = baseComponents.axis;
  const {
    hasY,
  } = baseComponents.config;
  const {
    axisName,
    chartData,
  } = baseComponents;
  const {
    yGetter,
  } = constants;

  x.domain(selection);
  y.domain([
    min(chartData, yGetter), max(chartData, yGetter),
  ]);

  select(`#${axisName}-xaxis`)
      .call(axisBottom(x));

  if (hasY) {
    select(`#${axisName}-yaxis`)
        .call(axisLeft(y));
  }
};

export const axisBuilder = (
    baseComponents,
    constants,
    name,
) => () => {
  const {
    size,
    yAxisMarginAdj,
  } = baseComponents.config;
  const {
    height,
    width,
    margin,
  } = size;
  const {
    data,
    xGetter,
    yGetter,
  } = constants;

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

  baseComponents.axis = [
    x, y,
  ];
  baseComponents.axisName = name;

  return (action) =>
    action == 'build' ?
      buildAxis(baseComponents) :
      updateAxis(baseComponents, constants);
};

