import React from 'react';

import {
  MessageProvider,
} from '@Components/reducers/message';
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
import {
  Message,
} from '@Common';

const Demeter = (props) => {
  return (
    <div
      id="game-wrapper pure-g"
      data-testid="app">
      <MessageProvider>
        <Message
          className="pure-u-5-5" />
        <InputControl />
        <PortfolioPerformance />
        <ExplainFortyYear />
      </MessageProvider>
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
