import React, {
  useEffect,
} from 'react';

import {
  MessageProvider,
} from '@Components/reducers/message';
import {
  PortfolioProvider,
  usePortfolio,
} from '@Components/reducers/portfolio';
import {
  PortfolioInfo,
} from './portfolioinfo';
import {
  PortfolioPerformance,
} from './portfolioperf';
import {
  Comparison,
} from './comparison';
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
  const {
    loadPortfolio,
  } = usePortfolio();

  useEffect(() => {
    loadPortfolio();
  }, [
  ]);

  return (
    <div
      id="game-wrapper pure-g"
      data-testid="app">
      <MessageProvider>
        <Message
          className="pure-u-5-5" />
        <PortfolioInfo />
        <InputControl />
        <PortfolioPerformance />
        <Comparison />
        <ExplainFortyYear />
      </MessageProvider>
    </div>
  );
};

export const DemeterApp = (props) => {
  return (
    <PortfolioProvider>
      <Demeter
        { ...props } />
    </PortfolioProvider>
  );
};
