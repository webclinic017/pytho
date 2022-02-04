import React from 'react';
import axios from 'axios';

import {
  useMessage,
} from '@Components/reducers/message';

const initialState = {
  stockData: undefined,
};

const actionTypes = {
  addStockData: 'ADD_STOCK_DATA',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.addStockData:
      return {
        ...state,
        stockData: action.data,
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
    const stockOverviewUrl = `/api/stockoverview?ticker=IBM`;
    return axios.get(process.env.API_URL + stockOverviewUrl)
        .then((results) => dispatch({
          type: 'ADD_STOCK_DATA',
          data: results.data,
        }))
        .catch((err) => {
          if (err.response) {
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
