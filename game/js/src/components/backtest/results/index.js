import React from 'react';

import {
  Button,
} from '@Components/common';
import {
  useBacktest,
} from '@Components/reducers/backtest';
import {
  useSSPortfolio,
} from '@Components/reducers/ssportfolio';

export const Results = (props) => {
  const {
    state: btState,
    runBacktest,
    renderResults,
  } = useBacktest();

  const {
    state: portfolioState,
  } = useSSPortfolio();

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
