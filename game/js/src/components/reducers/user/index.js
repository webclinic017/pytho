import React from 'react';

import {
  useMessage
} from '@Components/reducers/message';

const initialState = {
  portfolios: [], 
};

const actionTypes = {
  savePortfolio: 'SAVE_PORTFOLIO',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.savePortfolio:
     const copy = {...state.portfolios}
      copy[action.name] = action.portfolio
      return {
        ...state,
        portfolios: copy
      };

    default:
      new Error('Unknown action type');
  }
};

const UserContext = React.createContext();

export const useUser = () => {
  const context = React.useContext(UserContext);
  const {
    state, dispatch,
  } = context;
  const {
    errorMessage
  } = useMessage();

  const savePortfolio = (portfolio, name) => {
    if (name in state.portfolios) {
      errorMessage("Invalid portfolio name")
    } else {
      dispatch({
        type: 'SAVE_PORTFOLIO',
        portfolio,
        name,
      })
    }
  }

  return {
    state,
    savePortfolio,
  };
};

export const UserProvider = (props) => {
  const [
    state, dispatch,
  ] = React.useReducer(reducer, initialState);
  return <UserContext.Provider
    value={
      {
        state,
        dispatch,
      }
    }
    { ...props } />;
};
