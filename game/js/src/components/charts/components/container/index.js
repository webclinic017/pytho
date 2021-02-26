import React, {
  createContext,
} from 'react';
import PropTypes from 'prop-types';

export const ChartContext = createContext();

export const ChartContainer = (props) => {
  /*
   * ChartContainer provides no chart elements, it is just the viewbox which
   * contains the chart. Main functionality provided here are the margins
   * and the responsiveness
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
