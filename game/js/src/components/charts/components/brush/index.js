import {
  select,
} from 'd3-selection';
import {
  brushX,
} from 'd3-brush';

export const writeBrush = (chartState, brush, axis) => {
  const {
    invariants: {
      ref,
      rootBrush,
      rootWrapper,
      size: {
        width,
        height,
        margin,
      },
    },
  } = chartState;
  const [
    x,
  ] = axis;

  select(ref.current)
      .append('svg')
      .attr('id', rootBrush)
      .attr('viewBox', [
        0,
        0,
        width+margin.left+margin.right,
        height+10,
      ])
      .style('display', 'block');

  select(`#${rootBrush}`)
      .append('g')
      .attr('id', rootWrapper)
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

  select(`#${rootWrapper}`)
      .append('g')
      .attr('class', 'chart-brush')
      .call(brush)
};

export const initBrush = (chartState, defaultSelection) => {
  const { 
    invariants: {
      rootWrapper
    },
    brush 
  } = chartState;

  // Init brush selection
  select(`#${rootWrapper}`)
      .select('.chart-brush')
      .call(brush.move, defaultSelection);
}

export const brushBuilder = (chartState, axis, dispatch) => {
  const {
    brush,
    invariants: {
      rootWrapper,
      size: {
        width,
        margin,
        height,
      },
    },
  } = chartState;

  const [
    x,
  ] = axis;

  const brushed = ({
    selection,
  }) => {
    if (selection) {
      const xValues = selection.map(axis[0].invert);
      dispatch({type: "brush", xValues, selection})
    }
  };

  const brushended = ({
    selection,
  }) => {
    if (!selection) {
      dispatch({ type: 'initBrush' })
    }
  };

  return brushX()
      .extent([
        [
          0, 0.5,
        ], [
          width, height - margin.bottom + 0.5,
        ],
      ])
      .on('brush', brushed)
      .on('end', brushended);
};

