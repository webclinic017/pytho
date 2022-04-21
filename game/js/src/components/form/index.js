import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  getCssVar,
} from '@Helpers';

export const FormSelect = (props) => (
  <select
    { ...props }>
    {
      props.options.map((o, i) => (
        <option
          value={ o }
          key={ i }>
          {o}
        </option>
      ))
    }
  </select>
);

FormSelect.propTypes = {
  options: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]).isRequired,
};

export const FormInput = (props) => (
  <input
    { ...props } />
);

export const FormLabel = (props) => {
  return (
    <label
      { ...props }>
      {props.children}
    </label>
  );
};

FormLabel.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.arrayOf(PropTypes.node).isRequired,
  ]),
};

const StyledForm = styled.form`
  input[type="text"] {
    background-color: transparent;
    box-shadow: none;
    border: 1px solid var(--alt-background-color);
    color: var(--default-text-color);
    padding: 0.5rem 0.5rem;
    border-radius: 0px;
    font-size: 0.9rem;
    width: 100%;
    height: 2rem;

    &:placeholder-shown {
      font-style: italic;
    }
  }

  fieldset {
    border: none;
    
    label {
      margin: 0.5rem 0;
    }
  }

  select {
    height: 2rem;
    padding: 0.25rem 0.5rem;
    margin: 0.5rem 0;
    background-color: transparent;
    box-shadow: none;
    border: 1px solid var(--alt-background-color);
    color: var(--alt-text-color);
    font-size: 0.9rem;

    &:first-child {
      margin-top: 0;
      margin-bottom: 0.5rem;
    }

    option {
      color: var(--alt-text-color);
      background-color: var(--default-background-color);
    }

    option:first-child {
      color: var(--alt-text-color);
      background: var(--default-background-color);
    }
  }
`;


export const FormWrapper = (props) => {
  return (
    <StyledForm
      { ...props }>
      <fieldset>
        {props.children}
      </fieldset>
    </StyledForm>
  );
};

FormWrapper.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
};
