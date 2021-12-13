import {
  select,
} from 'd3-selection';
import {
  brushX,
} from 'd3-brush';
import {
  utcYear,
} from 'd3-time';

const buildBrush = (chartState) => () => {
  const {
    size,
  } = chartState.context;
  const {
    width,
    height,
    margin,
  } = size;
  const [
    x,
  ] = chartState.axis;

  const defaultSelection = [
    x(utcYear.offset(x.domain()[1], -1)), x.range()[1],
  ];

  select(chartState.context.ref.current)
      .append('svg')
      .attr('id', `${chartState.context.root}-brush-container`)
      .attr('viewBox', [
        0,
        0,
        width+margin.left+margin.right,
        height+10,
      ])
      .style('display', 'block');

  select(`#${chartState.context.root}-brush-container`)
      .append('g')
      .attr('class', 'chart-brush-wrapper')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

  select(`#${chartState.context.root}-brush-container`)
      .select('.chart-brush-wrapper')
      .append('g')
      .attr('class', 'chart-brush')
      .call(chartState.brush)
      .call(chartState.brush.move, defaultSelection);
};

const moveBrush = (chartState) => (selection) => {
  select(`#${chartState.context.root}-brush-container`)
      .select('.chart-brush')
      .call(chartState.brush)
      .call(chartState.brush.move, selection);
};

export const brushBuilder = (chartState) => () => {
  const {
    dispatcher,
    size,
  } = chartState.context;
  const {
    width,
    margin,
    height,
  } = size;
  const [
    x,
  ] = chartState.axis;

  const defaultSelection = [
    x(utcYear.offset(x.domain()[1], -1)), x.range()[1],
  ];

  const brushed = ({
    selection,
  }) => {
    if (selection) {
      const xValues = selection.map(chartState.axis[0].invert);
      dispatcher.call('brush', undefined, xValues);
    }
  };

  const brushended = ({
    selection,
  }) => {
    if (!selection) {
      select(`#${chartState.context.root}-brush-container`)
          .select('.chart-brush')
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

  chartState.brush = brush;
  return (action) =>
    action == 'build' ?
  buildBrush(chartState) :
  moveBrush(chartState);
};

