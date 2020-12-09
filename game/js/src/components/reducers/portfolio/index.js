import React from 'react';
import axios from 'axios';

import {
  portfolio,
  benchmarkPort,
} from './helpers/portfolio.js';

const initialState = {
  portfolio: null,
  benchmark: null,
  periods: [
  ],
  startVal: 100,
  lastStep: -1,
  hasNextStep: false,
  isFinished: false,
};

const actionTypes = {
  init: 'INIT',
  step: 'STEP',
  finish: 'FINISH',
  hasStep: 'HAS_STEP',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.init:
      return {
        ...state,
        portfolio: action.portfolio,
        periods: action.periods,
        benchmark: action.benchmark,
        hasNextStep: false,
        isFinished: false,
      };

    case actionTypes.step:
      return {
        ...state,
        lastStep: action.step,
      };

    case actionTypes.finish:
      return {
        ...state,
        isFinished: true,
        hasNextStep: false,
      };

    case actionTypes.hasStep:
      return {
        ...state,
        hasNextStep: action.step,
      };

    default:
      new Error('Unknown action type');
  }
};

const PortfolioContext = React.createContext();

export const usePortfolio = () => {
  const context = React.useContext(PortfolioContext);
  const {
    state, dispatch,
  } = context;

  const initPortfolio = (portfolio, periods, benchmark) =>
    dispatch({
      type: 'INIT',
      portfolio,
      periods,
      benchmark,
    });
  const stepPortfolio = (step) => dispatch({
    type: 'STEP',
    step,
  });
  const finishedSim = () => dispatch({
    type: 'FINISH',
  });
  const hasNextStep = (step) => dispatch({
    type: 'HAS_STEP',
    step,
  });

  const loadPortfolio = () => {
    axios.get(process.env.API_URL + '/api/sample')
        .then((res) => res.data)
        .then((res) => {
          const returns = res.data.map((v)=> v.data);
          const periods = res.data.map((v)=> v.period);
          const port = portfolio(
              state.startVal, returns);
          const benchmark = benchmarkPort(
              state.startVal, returns);

          initPortfolio(port, periods, benchmark);
        });
  };

  const nextStep = () => {
    const time = Date.now();
    state.benchmark.nextStep();
    const res = state.portfolio.nextStep();
    stepPortfolio(time);
    if (!res) {
      finishedSim();
    }
    return res;
  };

  const updateWeight = (e) => {
    e.preventDefault();
    const assetPosition = e.target.name;
    const value = e.target.value;

    if (value == '' || value == ' ') {
      const updated = state.portfolio.tryUpdateWeight(
          assetPosition, 0);
      hasNextStep(updated);
      return updated;
    } else {
      const updated = state.portfolio.tryUpdateWeight(
          assetPosition, value);
      hasNextStep(updated);
      return updated;
    }
  };

  return {
    state,
    loadPortfolio,
    nextStep,
    updateWeight,
  };
};

export const PortfolioProvider = (props) => {
  const [
    state, dispatch,
  ] = React.useReducer(reducer, initialState);
  return <PortfolioContext.Provider
    value={
      {
        state,
        dispatch,
      }
    }
    { ...props } />;
};
