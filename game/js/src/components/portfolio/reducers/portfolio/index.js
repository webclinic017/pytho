import React from 'react';

import {
  weightedPortfolio,
} from '@Components/portfolio/helpers/portfolio';

const initialState = {
  portfolio: null,
};

const actionTypes = {
  addToPortfolio: 'ADD_PORTFOLIO',
  removeFromPortfolio: 'REMOVE_PORTFOLIO',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.addToPortfolio:
      let ws = state.portfolio;
      if (ws == null) {
        ws = weightedPortfolio();
      }
      ws.addAsset(action.asset, action.weight);
      return {
        ...state,
        portfolio: ws,
      };
    case actionTypes.removeFromPortfolio:
      const copy = {
        ...state.portfolio,
      };
      copy.removeAsset(action.index);
      return {
        ...state,
        portfolio: copy,
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

  const addToPortfolio = (asset, weight) => dispatch({
    type: 'ADD_PORTFOLIO',
    asset,
    weight,
  });

  const removeFromPortfolio = (index) => dispatch({
    type: 'REMOVE_PORTFOLIO',
    index,
  });

  return {
    state,
    addToPortfolio,
    removeFromPortfolio,
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

