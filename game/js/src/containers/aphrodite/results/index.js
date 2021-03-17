import React from 'react';

import {
  Button,
} from '@Components/common';
import {
  useBacktest,
} from '@Components/reducers/backtest';
import {
  usePortfolio,
} from '@Components/portfolio';

export const Results = (props) => {
  const {
    state: btState,
    runBacktest,
    renderResults,
  } = useBacktest();

  const {
    state: portfolioState,
  } = usePortfolio();

  return (
    <div>
      <Button
        onClick={ () => runBacktest(portfolioState.portfolio) }>
        Run Backtest
      </Button>
      {!btState.results || renderResults()}
    </div>
  );
};
