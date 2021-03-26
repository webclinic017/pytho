import {
  timeParse,
} from 'd3-time-format';
import {
  dispatch,
} from 'd3-dispatch';
import {
  schemeCategory10
} from 'd3-scale-chromatic';

export const pieChartConstantsBuilder = (data, context)  => {
  return {
    data,
    dispatcher: dispatch('start', 'dataChange'),
    radius: 75,
    colour: schemeCategory10,
    valueGetter: (d) => parseInt(d[1]),
    ...context,
  }
}

export const stockPriceConstantsBuilder = (data, context) => {
  const tParser = timeParse('%d/%m/%Y');
  return {
    data,
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
    data,
    tParser,
    dispatcher: dispatch('start', 'brush', 'timebutton'),
    xGetter: (d) => tParser(d[0]),
    yGetter: (d) => d[1],
    ...context,
  };
};
