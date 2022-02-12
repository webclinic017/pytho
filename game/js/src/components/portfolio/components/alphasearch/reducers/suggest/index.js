import React from 'react';
import axios from 'axios';

const initialState = {
  securitySearch: '',
  securitiesOptions: [
  ],
};

const actionTypes = {
  clearInput: 'CLEAR_INPUT',
  clearOptions: 'CLEAR_OPTS',
  searchSecurity: 'SEARCH_SEC',
  inputSecurity: 'INPUT_SEC',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.clearOptions:
      return {
        ...state,
        securitiesOptions: [
        ],
      };

    case actionTypes.searchSecurity:
      return {
        ...state,
        securitiesOptions: action.options,
      };

    case actionTypes.inputSecurity:
      return {
        ...state,
        securitySearch: action.input,
      };

    case actionTypes.clearInput:
      return {
        ...state,
        securitySearch: '',
      };

    default:
      new Error('Unknown action type');
  }
};

const AlphaSuggestContext = React.createContext();

export const useAlphaSuggest = () => {
  const context = React.useContext(AlphaSuggestContext);
  const {
    state, dispatch,
  } = context;

  const inputSecurity = (security) =>
    dispatch({
      type: 'INPUT_SEC',
      input: security,
    });
  const clearOptions = () =>
    dispatch({
      type: 'CLEAR_OPTS',
    });
  const clearInput = () =>
    dispatch({
      type: 'CLEAR_INPUT',
    });
  const searchSecurity = ({
    value, reason,
  }) => {
    // eslint-disable-next-line
    const searchString = `/api/hermessuggest?&s=${value}`;
    axios.get(process.env.API_URL + searchString)
        .then((res) => res.data)
        .then((res) => dispatch({
          type: 'SEARCH_SEC',
          options: res.results,
        }));
  };

  return {
    state,
    inputSecurity,
    clearInput,
    clearOptions,
    searchSecurity,
  };
};

export const AlphaSuggestProvider = (props) => {
  const [
    state, dispatch,
  ] = React.useReducer(reducer, initialState);
  return <AlphaSuggestContext.Provider
    value={
      {
        state,
        dispatch,
      }
    }
    { ...props } />;
};

