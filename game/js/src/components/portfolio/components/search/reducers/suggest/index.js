import React from 'react';
import axios from 'axios';

const initialState = {
  securitySearch: '',
  securityType: 'fund',
  securitiesOptions: [
  ],
  securityTypes: [
    'fund',
    'etf',
    'stock',
    'index',
    'factor',
  ],
};

const actionTypes = {
  clearInput: 'CLEAR_INPUT',
  clearOptions: 'CLEAR_OPTS',
  selectSecurityType: 'SEL_SECTYPE',
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

    case actionTypes.selectSecurityType:
      return {
        ...state,
        securityType: action.securityType,
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

const SuggestContext = React.createContext();

export const useSuggest = () => {
  const context = React.useContext(SuggestContext);
  const {
    state, dispatch,
  } = context;

  const selectSecurityType = (value) =>
    dispatch({
      type: 'SEL_SECTYPE',
      securityType: value,
    });
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
    const {
      securityType,
    } = state;
    // eslint-disable-next-line
    const searchString = `/api/pricecoveragesuggest?security_type=${securityType}&s=${value}`;
    axios.get(process.env.API_URL + searchString)
        .then((res) => res.data)
        .then((res) => dispatch({
          type: 'SEARCH_SEC',
          options: res.coverage,
        }));
  };

  return {
    state,
    selectSecurityType,
    inputSecurity,
    clearInput,
    clearOptions,
    searchSecurity,
  };
};

export const SuggestProvider = (props) => {
  const [
    state, dispatch,
  ] = React.useReducer(reducer, initialState);
  return <SuggestContext.Provider
    value={
      {
        state,
        dispatch,
      }
    }
    { ...props } />;
};
