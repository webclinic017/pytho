import React from 'react';

import {
  useSimulation,
} from '@Components/reducers/simulation';
import {
  Panel,
  Title,
  Text,
} from '@Common';

import {
  PerfRow,
} from './components/perfrow';
import {
  PerfCountries,
} from './components/perfcountries';
import {
  Comparison,
} from './components/comparison';

export const PortfolioPerformance = (props) => {
  const {
    state,
  } = useSimulation();

  const {
    position,
    simResults,
    hasNextStep,
    simData,
    benchmarkResults,
  } = state;

  const portVal = position == 0 ? 100 : simResults.values.slice(-1)[0];


  if (position > 0) {
    return (
      <Panel
        data-testid="demeter-perfpanel">
        <div
          style={
            {
              margin: '1rem 0',
            }
          }
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
              align="left">
              Value
            </Title>
            <Text
              data-testid="forty-portfoliovalue"
              align="left"
              number
              highlight>
              {portVal}
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
              align="left">
              Period
            </Title>
            <Text
              data-testid="forty-portfolioperiod"
              align="left"
              number
              highlight>
              {position}
            </Text>
          </span>
        </div>

        <PerfRow
          first
          data={ simResults }
          period={ -1 }
          title={ 'Your Performance' } />
        <PerfRow
          period={ -1 }
          data={ benchmarkResults }
          title={ '60/40 Performance' } />
        <PerfCountries
          data={ simData }
          isFinished={ !hasNextStep } />
        <Comparison />
      </Panel>
    );
  } else {
    return <div />;
  }
};
