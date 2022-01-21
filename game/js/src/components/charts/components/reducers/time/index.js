import {
  writeReturn, updateReturn,
} from '../../return';
import {
  addButtonHook, timeButtonUpdater,
} from '../../timebuttons';
import {
  axisBuilder, updateAxis, writeAxis,
} from '../../axis';
import {
  lineBuilder, updateLine, writeLine,
} from '../../element';

export const init = ({
  data, ref, rootId,
}) => {
  return {
    data,
    axis: undefined,
    line: undefined,
    invariants: {
      ref,
      colours: [
        '#90E39A',
      ],
      root: rootId,
      rootWrapper: `${rootId}-chart-wrapper`,
      hasReturnText: true,
      size: {
        margin: {
          top: 10,
          right: 30,
          bottom: 20,
          left: 60,
        },
        width: 800,
        height: 430,
      },
      axisName: 'chart-axis',
      hasY: true,
    },
  };
};

export const writeGraph = (state, dispatch) => {
  // Build main chart d3 primitives in memory
  const axis = axisBuilder(state);
  const line = lineBuilder(state, axis);

  // Write main chart to UI
  writeAxis(state, axis);
  writeLine(state, line);
  if (state.invariants.hasReturnText) {
    writeReturn(state);
  }
  // Adding hook to time button press
  addButtonHook(dispatch);

  // Save primitives
  dispatch({
    type: 'init',
    line,
    axis,
  });
};

const findPositionsInValues = (xAxis, xValues, xGetter) => {
  return [
    xAxis.findIndex((d) =>
      xGetter(d).getTime() >= xValues[0].getTime()), xAxis.findIndex(
        (d) => xGetter(d).getTime() >= xValues[1].getTime()),
  ];
};

const filterValuesFromPositions = (xAxis, yAxis, positions) => {
  const [
    p0, p1,
  ] = positions;
  return [
    xAxis.slice(p0, p1), yAxis.map((row) => row.slice(p0, p1)),
  ];
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'init': {
      return {
        ...state,
        line: action.line,
        axis: action.axis,
      };
    }
    case 'timeButtonPress': {
      const {
        x, y,
      } = state.data;
      const {
        newSelection,
      } = timeButtonUpdater(action.period, x, y, state);
      // const xValues = newSelection.map(state.axis[0]);

      const {
        xGetter,
      } = state.data;

      // There is no better way to do this but this binds us
      // to xValues that are dates
      const positions = findPositionsInValues(x, newSelection, xGetter);
      const [
        xValues, yValues,
      ] = filterValuesFromPositions(x, y, positions);

      updateAxis(state, xValues, yValues);
      const line = updateLine(state, xValues, yValues);
      if (state.invariants.hasReturnText) {
        updateReturn(state, yValues);
      }

      return {
        ...state,
        line,
      };
    }
    default:
      throw new Error('Unknown action');
  }
};
