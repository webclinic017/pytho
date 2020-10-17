import React from 'react';
import Autosuggest from 'react-autosuggest';

import {
  FormWrapper,
  FormLabel,
  FormSelect,
} from '@Components/form';
import {
  useModel,
} from '@Components/reducers/riskattribution';

const willRenderFunc = (val) => {
  return (
    val.name ?
    val.name.trim().length > 2 :
    val.trim().length > 2
  );
};

export const Form = (props) => {
  const {
    state,
    selectSecurity,
    selectSecurityType,
    searchSecurity,
    inputSecurity,
    clearSecurity,
  } = useModel();

  const {
    securityType,
    securityTypes,
    securitiesOptions,
    securitySearch,
  } = state;

  return (
    <FormWrapper>
      <FormLabel>
        Security Type
      </FormLabel>
      <FormSelect
        data-testid="riskattribution-securitytype-dropdown"
        value={ securityType }
        options={ securityTypes }
        onChange={ (e) => selectSecurityType(e.target.value) } />
      <Autosuggest
        suggestions={ securitiesOptions }
        shouldRenderSuggestions={ (v) => willRenderFunc(v) }
        onSuggestionSelected={
          (e, { suggestion }) =>
            selectSecurity(suggestion)
        }
        onSuggestionsClearRequested={ clearSecurity }
        onSuggestionsFetchRequested={ searchSecurity }
        getSuggestionValue={ (item) => item.name }
        renderSuggestion={
          (item) => (
            <span>
              {item.name}
            </span>
          )
        }
        inputProps={
          {
            placeholder: 'Search security',
            value: securitySearch,
            onChange: (e, { newValue }) => inputSecurity(newValue),
          }
        }
      />
    </FormWrapper>
  );
};
