import React from 'react';

import {
  PortfolioBuilder,
  PortfolioDisplay,
  PortfolioProvider,
} from '@Components/portfolio';

import {
  PieChart,
} from './piechart';

const Hermes = (props) => {
  return (
    <div
      id="portfolioshare-main">
      <PortfolioBuilder />
      <PortfolioDisplay />
      <PieChart />
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
