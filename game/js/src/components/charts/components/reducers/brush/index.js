import { buildReturn } from "../../return"
import { addButtonHook } from "../../timebuttons"
import { axisBuilder } from "../../axis"
import { lineBuilder } from "../../element"
import { legendBuilder } from "../../legend"
import { brushBuilder } from "../../brush"

export const init = ({ data, ref, rootId }) => {
  return {
    data,
    ref,
    colours: [
      '#90E39A',
    ],
    rootContainer: rootId,
    root: `${rootId}-chart-wrapper`,
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
    axis: undefined,
    axisName: 'chart-axis',
    hasY: true,
    line: undefined,
    legend: undefined,
    brush: {
      context: {
        ref: ref,
        root: rootId,
        xGetter: data.xGetter,
        yGetter: data.yGetter,
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
      },
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
      axisName: 'brush-axis',
      axis: undefined,
      line: undefined,
      brush: undefined,
    },
    context: {
      xGetter: data.xGetter,
      yGetter: data.yGetter,
      colours: [
        '#90E39A',
      ],
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
    }
  }
}

export const initBrush = (state, dispatch) => () => {
  const returnText = buildReturn(state)
  const buttonHook = addButtonHook(state)
  const axis = axisBuilder(state)
  const line = lineBuilder(state)
  const legend = legendBuilder(state)
  const {x, y, labels} = state.data

  buttonHook();
  if (state.hasReturnText) {
    returnText(x, y);
  }
  axis(x, y)('build')();
  line(x)('build')(x, y);
  if (labels) {
    legend()('build')(labels);
  }

  let brushAxis = axisBuilder(state.brush)
  let brushLine = lineBuilder(state.brush)
  let brush = brushBuilder(state.brush, dispatch)

  brushAxis = brushAxis(x, y);
  brush = brush();
  brush('build')();

  brushLine = brushLine();
  brushAxis('build')();
  brushLine('build')(x, y);

  const components = {
    axis,
    line,
    legend,
    brush : {
      brush,
      line: brushLine,
      axis: brushAxis
    }, 
  }
  dispatch({type: 'init', components})
}

export const reducer = (state, action) => {
  switch(action.type) {
    case 'init':
     return {...state, ...action.components};
    case 'brush':
      //const selection = action.newSelection.map(state.axis[0]);
      //state.brush('move')(selection);

      const {
          xGetter,
      } = state.context;

      const {
        x, y
      } = state.data;

      // There is no better way to do this but this binds us
      // to xValues that are dates
      const positions = [
        x.findIndex((d) =>
          xGetter(d).getTime() >= action.xValues[0].getTime()), x.findIndex(
            (d) => xGetter(d).getTime() >= action.xValues[1].getTime()),
      ];

      const filteredXValues = x.slice(positions[0], positions[1]);
      const filteredYValues = y.map(
          (row) => row.slice(positions[0], positions[1]));
      
      axisBuilder(state)(x, y)('update')(filteredXValues, filteredYValues)
      lineBuilder(state)(filteredXValues)('update')(filteredYValues);
      if (state.context.hasReturnText) {
        updateReturn(filteredYValues);
      }
      //const selection = newSelection.map(state.axis[0]);
      return {...state}
    case 'timebuttons':
        const {
        newSelection,
        } = timeButtonUpdater(period, xValues, yValues, state);
        mover(xValues, yValues, newSelection);
        return {...state}
    default:
      throw new Error("Unknown action");
  }
}