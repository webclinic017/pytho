import { buildReturn } from "../../return"
import { addButtonHook } from "../../timebuttons"
import { axisBuilder } from "../../axis"
import { lineBuilder } from "../../element"
import { legendBuilder } from "../../legend"

export const init = ({ data, ref, rootId }) => {
  return {
    data,
    ref,
    colours: [
      '#90E39A',
    ],
    rootId,
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
    line: undefined,
    legend: undefined,
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

export const reducer = (state, action) => {
  switch(action.type) {
    case 'init':
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
      return {...state, axis, line, legend};
    default:
      throw new Error("Unknown action");
  }
}