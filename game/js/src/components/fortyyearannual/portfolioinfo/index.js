import React from 'react';

import { usePortfolio } from '@Components/reducers/portfolio';

import {
  Panel,
  Title,
  Text,
} from '@Common';

export const PortfolioInfo = (props) => {
  const { state } = usePortfolio();
  const {
    portfolio,
    startVal,
  } = state;

  const ifPeriod = portfolio ?
    portfolio.period.getPeriod() :
    0;

  const ifPortfolioValue = portfolio ?
    portfolio.getValue() :
    startVal;

  return (
    <Panel>
      <div
        className="pure-g">
        <span
          id="portfolio-current-value"
          className="pure-u-12-24"
          data-testid="app-portvalue"
          style={
            {
              display: 'flex',
              flexDirection: 'column',
            }
          }>
          <Title
            light
            align="right">
            Value
          </Title>
          <Text
            data-testid="forty-portfoliovalue"
            number
            highlight>
            {ifPortfolioValue}
          </Text>
        </span>
        <span
          id="portfolio-current-period"
          className="pure-u-12-24"
          data-testid="app-period"
          style={
            {
              display: 'flex',
              flexDirection: 'column',
            }
          }>
          <Title
            light
            align="right">
            Period
          </Title>
          <Text
            data-testid="forty-portfolioperiod"
            number
            highlight>
            {ifPeriod}
          </Text>
        </span>
      </div>
    </Panel>
  );
};

