import React, {
  createContext,
} from 'react';
import PropTypes from 'prop-types';

export const ChartContext = createContext();

export const ChartContainer = (props) => {
  /*
   * ChartContainer provides no chart elements, it just provides
   * the Context.
   */

  const ref = React.createRef();

  const initialState = {
    ref,
  };

  return (
    <ChartContext.Provider
      value={ initialState }>
      {props.children}
    </ChartContext.Provider>
  );
};

ChartContainer.propTypes = {
  children: PropTypes.element.isRequired,
};
