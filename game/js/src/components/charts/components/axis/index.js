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

  select(`#${chartState.root}`)
      .append('g')
      .attr('class', `${axisName}-xaxis`)
      .attr('transform', `translate(0, ${bottomMargin})`)
      .call(axisBottom(x));

  if (hasY) {
    select(`#${chartState.root}`)
        .append('g')
        .attr('class', `${axisName}-yaxis`)
        .call(axisLeft(y));
  }
};

const updateAxis = (chartState) => (xValues, yValues) => {
  const [
    x, y,
  ] = chartState.axis;
  const {
    axisName,
    hasY,
  } = chartState;
  const {
    xGetter,
    yGetter,
  } = chartState.context;

  x.domain(extent(xValues, xGetter));

  const minYVal = min(yValues, (d)=> min(d.map(yGetter)));
  const maxYVal = max(yValues, (d) => max(d.map(yGetter)));
  y.domain([
    minYVal, maxYVal,
  ]);

  select(`#${chartState.root}`)
      .select(`.${axisName}-xaxis`)
      .call(axisBottom(x));

  if (hasY) {
    select(`#${chartState.root}`)
        .select(`.${axisName}-yaxis`)
        .call(axisLeft(y));
  }
};

export const axisBuilder = ( chartState ) => (xValues, yValues) => {
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
      .domain(extent(xValues, xGetter))
      .range([
        0, width,
      ]);

  const minYVal = min(yValues, (d)=> min(d.map(yGetter)));
  const maxYVal = max(yValues, (d) => max(d.map(yGetter)));

  const y = scaleLinear()
      .domain([
        minYVal, maxYVal,
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

