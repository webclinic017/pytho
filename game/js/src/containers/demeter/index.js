import React from 'react';

import {
  SimulationProvider,
} from '@Components/reducers/simulation';
import {
  PortfolioPerformance,
} from './portfolioperf';
import {
  InputControl,
} from './inputcontrol';
import {
  ExplainFortyYear,
} from './explain';

const Demeter = (props) => {
  return (
    <div
      id="game-wrapper pure-g"
      data-testid="app">
      <InputControl />
      <PortfolioPerformance />
      <ExplainFortyYear />
    </div>
  );
};

export const DemeterApp = (props) => {
  return (
    <SimulationProvider>
      <Demeter
        { ...props } />
    </SimulationProvider>
  );
};
