import React from 'react';
import axios from 'axios';

const initialState = {
  results: undefined,
};

const actionTypes = {
  addResults: 'ADD_RES',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.addResults:
      return {
        ...state,
        results: action.results,
      };

    default:
      throw Error('Action type not supported');
  }
};

const BacktestContext = React.createContext();

export const useBacktest = () => {
  const context = React.useContext(BacktestContext);
  const {
    state, dispatch,
  } = context;

  const runBacktest = (portObj) => {
    const toPost = {
      'data': {
        'assets': portObj.assets.map((i) => parseInt(i.id)),
        'weights': portObj.weights.map((i) => parseInt(i)/100),
      },
    };
    const backtestUrl = `/api/backtest`;
    return axios.post(process.env.API_URL + backtestUrl, toPost)
        .then((res) => res.data)
        .then((results) => dispatch({
          type: 'ADD_RES',
          results: results.data,
        }));
  };

  const renderResults = () => {
    const {
      results,
    } = state;
    return (
      <div>
        <div>
          Cagr:
          {results.cagr}
        </div>
        <div>
          Vol:
          {results.vol}
        </div>
        <div>
          MaxDD:
          {results.maxdd}
        </div>
      </div>
    );
  };

  return {
    state,
    runBacktest,
    renderResults,
  };
};

export const BacktestProvider = (props) => {
  const [
    state, dispatch,
  ] = React.useReducer(reducer, initialState);
  return <BacktestContext.Provider
    value={
      {
        state,
        dispatch,
      }
    }
    { ...props } />;
};
