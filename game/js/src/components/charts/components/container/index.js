import React, {
  createContext,
} from 'react';
import PropTypes from 'prop-types';

export const ChartContext = createContext();

export const ChartContainer = ({
  constantsBuilder, stateBuilder, stateBuilders, children,
}) => {
  /*
   * ChartContainer provides no chart elements, it just provides
   * the Context.
   */

  const ref = React.createRef();
  const constants = constantsBuilder();

  const initialState = {
    ...constants,
    ref,
  };
  if (stateBuilders) {
    initialState.builderFuncs = [
      ...stateBuilders.map((s) => s(initialState)),
    ];
  } else {
    initialState.builderFuncs = stateBuilder(initialState);
  }

  return (
    <ChartContext.Provider
      value={ initialState }>
      {children}
    </ChartContext.Provider>
  );
};

ChartContainer.propTypes = {
  children: PropTypes.element.isRequired,
  constantsBuilder: PropTypes.func.isRequired,
  stateBuilder: PropTypes.func,
  stateBuilders: PropTypes.array,
};

