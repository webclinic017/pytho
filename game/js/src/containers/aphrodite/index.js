import React from 'react';

import {
  SSPortfolioProvider,
} from '@Components/reducers/ssportfolio';
import {
  BacktestProvider,
} from '@Components/reducers/backtest';
import {
  Builder,
} from './builder';
import {
  PortfolioDetails,
} from './portfoliodetails';
import {
  Results,
} from './results';

const Aphrodite = (props) => {
  return (
    <div
      id="pure-g"
      data-testid="app">
      <Builder />
      <PortfolioDetails />
      <Results />
    </div>
  );
};

export const AphroditeApp = (props) => {
  return (
    <SSPortfolioProvider>
      <BacktestProvider>
        <Aphrodite
          { ...props } />
      </BacktestProvider>
    </SSPortfolioProvider>
  );
};
