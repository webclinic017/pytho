import React from 'react';

import {
  ComponentWrapper,
} from '@Style';
import {
  useStockOverview,
} from '@Components/reducers/stockoverview';
import {
  LineChartWithTimeButtons,
} from '@Components/charts';

export const PriceChart = (props) => {
  const {
    state,
  } = useStockOverview();

  const {
    prices,
    ticker,
  } = state;

  if (!prices) {
    return null;
  } else {
    const yValues = [
      prices.close,
    ];
    const labels = [
      ticker,
    ];
    return (
      <ComponentWrapper>
        <LineChartWithTimeButtons
          xValues={ prices.dates }
          yValues={ yValues }
          labels={ labels }
          rootId={ 'chart-container-stocks' } />
      </ComponentWrapper>
    );
  }
};
