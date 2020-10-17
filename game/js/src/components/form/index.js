import React from 'react';
import PropTypes from 'prop-types';

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
    { ...props }
    style={{ fontSize: '0.8rem' }} />
);

export const FormLabel = (props) => {
  return (
    <label
      style={
        { fontSize: '0.9rem',
          color: '#484848' }
      }
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

export const FormWrapper = (props) => {
  return (
    <form
      { ...props }
      style={
        { margin: '0rem',
          marginTop: '1rem' }
      }
      className="pure-form pure-form-stacked">
      <fieldset>
        {props.children}
      </fieldset>
    </form>
  );
};

FormWrapper.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
};
