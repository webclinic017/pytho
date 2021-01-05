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

const Backtest = (props) => {
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

export const BacktestApp = (props) => {
  return (
    <SSPortfolioProvider>
      <BacktestProvider>
        <Backtest
          { ...props } />
      </BacktestProvider>
    </SSPortfolioProvider>
  );
};
