import React from 'react';

import {
  PortfolioBuilder,
  PortfolioDisplay,
  PortfolioProvider,
  PortfolioLoader,
} from '@Components/portfolio';

import {
  PieChartBuilder,
} from './piechart';

const Hermes = (props) => {
  return (
    <div
      id="portfolioshare-main">
      <PortfolioBuilder />
      <PortfolioDisplay />
      <PortfolioLoader />
      <PieChartBuilder />
    </div>
  );
};

export const HermesApp = (props) => {
  return (
    <PortfolioProvider>
      <Hermes
        { ...props } />
    </PortfolioProvider>
  );
};
