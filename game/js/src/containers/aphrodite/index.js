import React from 'react';

import {
  BacktestProvider,
} from '@Components/reducers/backtest';
import {
  PortfolioBuilder,
  PortfolioDisplay,
  PortfolioProvider,
} from '@Components/portfolio';
import {
  Results,
} from './results';

const Aphrodite = (props) => {
  return (
    <div
      id="pure-g"
      data-testid="app">
      <PortfolioBuilder />
      <PortfolioDisplay />
      <Results />
    </div>
  );
};

export const AphroditeApp = (props) => {
  return (
    <PortfolioProvider>
      <BacktestProvider>
        <Aphrodite
          { ...props } />
      </BacktestProvider>
    </PortfolioProvider>
  );
};
