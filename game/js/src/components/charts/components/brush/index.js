import {
  select,
} from 'd3-selection';
import {
  brushX,
} from 'd3-brush';
import {
  utcYear,
} from 'd3-time';

export const brushBuilder = (axis, ctx, dispatcher) => {
  const {
    width,
    margin,
  } = ctx;
  const [
    x,
  ] = axis;
  const focusHeight = 100;

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

  return brushX()
      .extent([
        [
          0, 0.5,
        ], [
          width, focusHeight - margin.bottom + 0.5,
        ],
      ])
      .on('brush', brushed)
      .on('end', brushended);
};

export const buildBrush = (root, brush, axis, ctx) => {
  const {
    width,
    height,
    margin,
  } = ctx;

  const [
    x,
  ] = axis;

  const defaultSelection = [
    x(utcYear.offset(x.domain()[1], -1)), x.range()[1],
  ];

  select(root)
      .append('svg')
      .attr('id', 'chart-brush-container')
      .attr('viewBox', [
        0,
        0,
        width+margin.left+margin.right,
        height+margin.top+margin.bottom,
      ])
      .style('display', 'block')
      .append('g')
      .attr('id', 'chart-brush-wrapper')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

  select('#chart-brush-wrapper')
      .append('g')
      .attr('id', 'chart-brush')
      .call(brush)
      .call(brush.move, defaultSelection);
};

export const moveBrush = (selection, brush) => {
  select('#chart-brush')
      .call(brush)
      .call(brush.move, selection);
}
