import {
  timeParse,
} from 'd3-time-format';
import {
  dispatch,
} from 'd3-dispatch';
import {
  schemeCategory10,
} from 'd3-scale-chromatic';

export const pieChartConstantsBuilder = () => {
  const startX = -100;
  return {
    size: {
      margin: {
        top: 10,
        right: 30,
        bottom: 30,
        left: 60,
      },
      width: 300,
      height: 200,
    },
    root: 'chart-container-piechart',
    dispatcher: dispatch('start', 'dataChange'),
    radius: 75,
    colour: schemeCategory10,
    valueGetter: (d) => parseInt(d[1]),
    xPos: (d) => startX + 15,
    yPos: (d, i) => 100 + (i * 10),
    rectXPos: (d) => startX,
    rectYPos: (d, i) => 93 + (i*10),
    textBuilder: (d) => `${d[1]}% - ${d[0].name}`,
  };
};

export const stockPriceConstantsBuilder = () => {
  const tParser = timeParse('%d/%m/%Y');
  return {
    size: {
      margin: {
        top: 10,
        right: 30,
        bottom: 30,
        left: 60,
      },
      width: 800 - 60 - 30,
      height: 400 - 10 - 30,
    },
    tParser,
    dispatcher: dispatch('start', 'brush', 'timebutton'),
    xGetter: (d) => tParser(d),
    yGetter: (d) => d,
    hasReturnText: true,
    colours: [
      '#90E39A',
    ],
  };
};

export const backTestResultsConstantsBuilder = () => {
  const tParser = timeParse('%Q');
  return {
    size: {
      margin: {
        top: 10,
        right: 30,
        bottom: 30,
        left: 60,
      },
      width: 800 - 60 - 30,
      height: 400 - 10 - 30,
    },
    tParser,
    root: 'chart-container-backtest',
    dispatcher: dispatch('start', 'brush', 'timebutton'),
    xGetter: (d) => tParser(d),
    yGetter: (d) => d,
    hasReturnText: true,
    colours: [
      '#90E39A',
    ],
  };
};

export const exposureAnalysisCoefsConstantsBuilder = () => {
  const tParser = timeParse('%s');
  return {
    size: {
      margin: {
        top: 10,
        right: 30,
        bottom: 30,
        left: 60,
      },
      width: 800 - 60 - 30,
      height: 400 - 10 - 30,
    },
    tParser,
    root: 'chart-container-exposure-coefs',
    dispatcher: dispatch('start'),
    xGetter: (d) => tParser(d),
    yGetter: (d) => d,
    colours: [
      '#90E39A',
      '#F38D68',
      '#1B9AAA',
      '#a05195',
      '#662C91',
      '#F3CA40',
      '#E71D36',
      '#E56B70',
      '#F75C03',
      '#FC6DAB',
    ],
  };
};

export const exposureAnalysisAlphaConstantsBuilder = () => {
  const tParser = timeParse('%s');
  return {
    size: {
      margin: {
        top: 10,
        right: 30,
        bottom: 30,
        left: 60,
      },
      width: 800 - 60 - 30,
      height: 400 - 10 - 30,
    },
    tParser,
    root: 'chart-container-exposure-alpha',
    dispatcher: dispatch('start'),
    xGetter: (d) => tParser(d),
    yGetter: (d) => d,
    colours: [
      '#90E39A',
    ],
  };
};
