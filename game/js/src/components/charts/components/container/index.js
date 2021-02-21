import React, {
  createRef, createContext,
} from 'react';

export const ChartContext = createContext();

export const ChartContainer = (props) => {
  /*
   * ChartContainer provides no chart elements, it is just the viewbox which
   * contains the chart. Main functionality provided here are the margins
   * and the responsiveness
   */

  const margin = {
    top: 10,
    right: 30,
    bottom: 30,
    left: 60,
  };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
  const ref = React.createRef();

  const initialState = {
    margin,
    width,
    height,
    ref,
  };

  return (
    <ChartContext.Provider
      value={ initialState }>
      {props.children}
    </ChartContext.Provider>
  );
};

