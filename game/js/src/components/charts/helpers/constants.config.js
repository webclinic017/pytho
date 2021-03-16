import {
  timeParse,
} from 'd3-time-format';
import {
  dispatch,
} from 'd3-dispatch';

export const stockPriceConstantsBuilder = (data, context) => {
  const tParser = timeParse('%d/%m/%Y');
  return {
    root: undefined,
    data: data,
    tParser,
    dispatcher: dispatch('start', 'brush', 'timebutton'),
    xGetter: (d) => tParser(d.date),
    yGetter: (d) => d.close,
    ...context,
  };
};

export const backTestResultsConstantsBuilder = (data, context) => {
  const tParser = timeParse('%Q');
  return {
    root: undefined,
    data: data,
    tParser,
    dispatcher: dispatch('start', 'brush', 'timebutton'),
    xGetter: (d) => tParser(d[0]),
    yGetter: (d) => d[1],
    ...context,
  };
};
