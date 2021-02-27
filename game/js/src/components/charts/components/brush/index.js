import {
  select,
} from 'd3-selection';
import {
  brushX,
} from 'd3-brush';
import {
  utcYear,
} from 'd3-time';

const buildBrush = (baseComponents, constants) => () => {
  const {
    size,
  } = baseComponents.config;
  const {
    width,
    height,
    margin,
  } = size;
  const [
    x,
  ] = baseComponents.axis;

  const defaultSelection = [
    x(utcYear.offset(x.domain()[1], -1)), x.range()[1],
  ];

  select(constants.ref.current)
      .append('svg')
      .attr('id', 'chart-brush-container')
      .attr('viewBox', [
        0,
        0,
        width+margin.left+margin.right,
        height+margin.top+margin.bottom,
      ])
      .style('display', 'block');

  select('#chart-brush-container')
      .append('g')
      .attr('id', 'chart-brush-wrapper')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

  select('#chart-brush-wrapper')
      .append('g')
      .attr('id', 'chart-brush')
      .call(baseComponents.brush)
      .call(baseComponents.brush.move, defaultSelection);
};

const moveBrush = (baseComponents) => (selection) => {
  select('#chart-brush')
      .call(baseComponents.brush)
      .call(baseComponents.brush.move, selection);
};

export const brushBuilder = (baseComponents, constants) => () => {
  const {
    dispatcher,
  } = constants;
  const {
    size,
  } = baseComponents.config;
  const {
    width,
    margin,
    height,
  } = size;
  const [
    x,
  ] = baseComponents.axis;

  const defaultSelection = [
    x(utcYear.offset(x.domain()[1], -1)), x.range()[1],
  ];

  const brushed = ({
    selection,
  }) => {
    if (selection) {
      dispatcher.call('brush', undefined, selection);
    }
  };

  const brushended = ({
    selection,
  }) => {
    if (!selection) {
      select('#chart-brush')
          .call(brush.move, defaultSelection);
    }
  };

  const brush = brushX()
      .extent([
        [
          0, 0.5,
        ], [
          width, height - margin.bottom + 0.5,
        ],
      ])
      .on('brush', brushed)
      .on('end', brushended);

  baseComponents.brush = brush;
  return (action) =>
    action == 'build' ?
  buildBrush(baseComponents, constants) :
  moveBrush(baseComponents);
};

