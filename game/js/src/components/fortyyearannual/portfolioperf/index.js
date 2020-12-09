import React from 'react';

import {
  usePortfolio,
} from '@Components/reducers/portfolio';
import {
  Panel,
} from '@Common';

import {
  PerfRow,
} from './components/perfrow';

export const PortfolioPerformance = (props) => {
  const {
    state,
  } = usePortfolio();
  const {
    portfolio,
    benchmark,
    periods,
    isFinished,
  } = state;

  if (portfolio && portfolio.period.getPeriod() > 0) {
    const perfObj = portfolio.getPerformance();
    const benchObj = benchmark.getPerformance();

    const assetTitles = [
      'Equity 1',
      'Equity 2',
      'Bond 1',
      'Bond 2',
    ];

    return (
      <Panel>
        <PerfRow
          first
          data={ perfObj['portfolioPerf'] }
          period={ -1 }
          title={ 'Your Performance' } />
        <PerfRow
          period={ -1 }
          data={ benchObj['portfolioPerf'] }
          title={ '60/40 Performance' } />
        {
          perfObj['assetsPerf'].map((d, i) => {
            return (
              <PerfRow
                key={ i }
                data={ d }
                period={ isFinished && periods.length > 0 ? periods[i]: -1 }
                title={ assetTitles[i] } />
            );
          })
        }
      </Panel>
    );
  } else {
    return <div />;
  }
};
