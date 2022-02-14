import React from 'react';
import axios from 'axios';

import {
  useMessage,
} from '@Components/reducers/message';

const initialState = {
  ticker: undefined,
  prices: undefined,
  fundies: undefined,
  summary: undefined,
};

const actionTypes = {
  addStockData: 'ADD_STOCK_DATA',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.addStockData:
      return {
        ...state,
        prices: action.prices,
        fundies: action.fundies,
        ticker: action.ticker,
        summary: action.summary,
      };

    default:
      throw Error('Action type not supported');
  }
};

const StockOverviewContext = React.createContext();

export const useStockOverview = () => {
  const context = React.useContext(StockOverviewContext);
  const {
    state, dispatch,
  } = context;

  const {
    errorMessage,
  } = useMessage();

  const getOverview = (ticker) => {
    const priceUrl = `/api/hermesdailyprice?ticker=${ticker}`;
    const fundiesUrl = `/api/hermesfundamentals?ticker=${ticker}`;
    const summaryUrl = `/api/hermessummary?ticker=${ticker}`;
    const reqs = [priceUrl, fundiesUrl, summaryUrl]

    return axios.all(reqs.map(r => axios.get(process.env.API_URL + r)))
      .then((r) => dispatch({ type: 'ADD_STOCK_DATA', prices: r[0].data, fundies: r[1].data, summary: r[2].data, ticker }))
      .catch((err) => {
        if(err.response){
          errorMessage(err.response.data.message);
        }
      })
  };

  return {
    state,
    getOverview,
  };
};

export const StockOverviewProvider = (props) => {
  const [
    state, dispatch,
  ] = React.useReducer(reducer, initialState);
  return <StockOverviewContext.Provider
    value={
      {
        state,
        dispatch,
      }
    }
    { ...props } />;
};
