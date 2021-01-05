import React from 'react';

const initialState = {
  portfolio: null,
  weight: '',
  security: null,
};

const actionTypes = {
  addToPortfolio: 'ADD_PORTFOLIO',
  addSecurity: 'ADD_SEC',
  addWeight: 'ADD_WEIGHT',
  removeFromPortfolio: 'REMOVE_PORTFOLIO',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.addWeight:
      return {
        ...state,
        weight: action.weight,
      };
    case actionTypes.addSecurity:
      return {
        ...state,
        security: action.security,
      };
    case actionTypes.addToPortfolio:
      let updated = {};

      if (state.portfolio == null) {
        updated = {
          assets: [
          ],
          weights: [
          ],
        };
        updated.assets = [
          action.asset,
        ];
        updated.weights = [
          action.weight,
        ];
      } else {
        updated = {
          ...state.portfolio,
        };
        updated.assets = [
          ...updated.assets, action.asset,
        ];
        updated.weights = [
          ...updated.weights, action.weight,
        ];
      }
      return {
        ...state,
        portfolio: updated,
        weight: '',
        security: null,
      };
    case actionTypes.removeFromPortfolio:
      const copy = {
        ...state.portfolio,
      };
      copy.assets.splice(action.index, 1);
      copy.weights.splice(action.index, 1);
      return {
        ...state,
        portfolio: copy,
      };
    default:
      new Error('Unknown action type');
  }
};

const SSPortfolioContext = React.createContext();

export const useSSPortfolio = () => {
  const context = React.useContext(SSPortfolioContext);
  const {
    state, dispatch,
  } = context;

  const addToPortfolio = (asset, weight) => dispatch({
    type: 'ADD_PORTFOLIO',
    asset,
    weight,
  });

  const addWeight = (weight) => dispatch({
    type: 'ADD_WEIGHT',
    weight,
  });

  const addSecurity = (security) => dispatch({
    type: 'ADD_SEC',
    security,
  });

  const removeFromPortfolio = (index) => dispatch({
    type: 'REMOVE_PORTFOLIO',
    index,
  });

  return {
    state,
    addWeight,
    addSecurity,
    addToPortfolio,
    removeFromPortfolio,
  };
};

export const SSPortfolioProvider = (props) => {
  const [
    state, dispatch,
  ] = React.useReducer(reducer, initialState);
  return <SSPortfolioContext.Provider
    value={
      {
        state,
        dispatch,
      }
    }
    { ...props } />;
};
