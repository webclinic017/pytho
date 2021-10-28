import React from 'react';

import {
  BacktestProvider,
} from '@Components/reducers/backtest';
import {
  LoaderProvider,
} from '@Components/reducers/loader';
import {
  PortfolioBuilder,
  PortfolioDisplay,
  PortfolioProvider,
  PortfolioLoader,
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
      <PortfolioLoader />
      <Results />
    </div>
  );
};

export const AphroditeApp = (props) => {
  return (
    <PortfolioProvider>
      <BacktestProvider>
        <LoaderProvider>
          <Aphrodite
            { ...props } />
        </LoaderProvider>
      </BacktestProvider>
    </PortfolioProvider>
  );
};
