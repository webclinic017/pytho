import React from 'react';
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
import {
  brushBuilder, initBrush, writeBrush,
} from '../../brush';
import { timeParse } from 'd3-time-format';
import { utcYear } from 'd3-time';

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
    brush: {
      data,
      axis: undefined,
      line: undefined,
      brush: undefined,
      invariants: {
        ref,
        colours: [
          '#90E39A',
        ],
        root: rootId,
        rootBrush: `${rootId}-brush`,
        rootWrapper: `${rootId}-brush-wrapper`,
        size: {
          margin: {
            top: 10,
            right: 30,
            bottom: 20,
            left: 60,
          },
          width: 800,
          height: 100,
        },
        yAxisMarginAdj: true,
        axisName: 'brush-axis',
      },
    },
  };
};

export const writeGraph = (state, dispatch) => {
  // Build main chart d3 primitives in memory
  const axis = axisBuilder(state);
  const line = lineBuilder(state, axis);

  // Build brush chart d3 primitives in memory
  const brushAxis = axisBuilder(state.brush);
  const brush = brushBuilder(state.brush, brushAxis, dispatch);
  const brushLine = lineBuilder(state.brush, brushAxis);

  // Write main chart to UI
  writeAxis(state, axis);
  writeLine(state, line);
  if (state.hasReturnText) {
    writeReturn(state);
  }

  // Write brush chart to UI
  writeBrush(state.brush, brush, brushAxis);

  writeAxis(state.brush, brushAxis);
  writeLine(state.brush, brushLine);

  // Adding hook to time button press
  addButtonHook(dispatch);

  // Save primitives
  dispatch({
    type: 'init',
    line,
    axis,
    brush,
    brushLine,
    brushAxis,
  });

  dispatch({ type: 'initBrush' })

};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'init': {
      return {
        ...state,
        line: action.line,
        axis: action.axis,
        brush: {
          ...state.brush,
          brush: action.brush,
          line: action.brushLine,
          axis: action.brushAxis,
        },
      };
    }
    case "initBrush": {
      const [ x, y ] = state.axis;
      const defaultSelection = [
        x(utcYear.offset(x.domain()[1], -1)), x.range()[1],
      ];
      initBrush(state.brush, defaultSelection);
      return {
        ...state,
      };
    }
    case "brush": {
      const {
        x,
        y,
        xGetter,
      } = state.data;

      const {
        xValues
      } = action;

      // There is no better way to do this but this binds us
      // to xValues that are dates
      const positions = [
        x.findIndex((d) =>
          xGetter(d).getTime() >= xValues[0].getTime()), x.findIndex(
            (d) => xGetter(d).getTime() >= xValues[1].getTime()),
      ];

      const filteredXValues = x.slice(positions[0], positions[1]);
      const filteredYValues = y.map((row) => row.slice(positions[0], positions[1]));

      updateAxis(state, filteredXValues, filteredYValues);
      const line = updateLine(state, filteredXValues, filteredYValues);
      if (state.hasReturnText) {
        updateReturn(state, filteredYValues);
      }
      return {
        ...state,
        line,
      }
    }
    case "timeButtonPress": {
      const {
        x, y,
      } = state.data;
      const {
        newSelection: xValues,
      } = timeButtonUpdater(action.period, x, y, state);
      //const xValues = newSelection.map(state.axis[0]);

      const {
        xGetter,
      } = state.data;

      // There is no better way to do this but this binds us
      // to xValues that are dates
      const positions = [
        x.findIndex((d) =>
          xGetter(d).getTime() >= xValues[0].getTime()), x.findIndex(
            (d) => xGetter(d).getTime() >= xValues[1].getTime()),
      ];

      const filteredXValues = x.slice(positions[0], positions[1]);
      const filteredYValues = y.map((row) => row.slice(positions[0], positions[1]));

      updateAxis(state, filteredXValues, filteredYValues);
      const line = updateLine(state, filteredXValues, filteredYValues);
      if (state.hasReturnText) {
        updateReturn(state, filteredYValues);
      }

      return {
        ...state,
        line,
      }
    }
    default:
      throw new Error('Unknown action');
  }
};

const BrushChartContext = React.createContext();

export const useBrushChart = () => {
  const context = React.useContext(BrushChartContext);
  const {
    state, dispatch,
  } = context;

  return {
    state,
    dispatch,
  };
};

export const BrushChartProvider = (props) => {
  const {
    xValues,
    yValues,
    labels,
    rootId,
  } = props;
  const tParser = timeParse('%s');
  const initState = {
    ref: React.createRef(),
    rootId,
    data: {
      x: xValues,
      y: yValues,
      xGetter: (d) => tParser(d),
      yGetter: (d) => d,
      labels,
    },
  };

  const [
    state, dispatch,
  ] = React.useReducer(
      reducer, initState, init,
  );

  return <BrushChartContext.Provider
    value={
      {
        state,
        dispatch,
      }
    }
    { ...props } />;
};
