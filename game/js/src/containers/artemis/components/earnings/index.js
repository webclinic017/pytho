import React from 'react';

import {
  ComponentWrapper,
} from '@Style';
import {
  useStockOverview,
} from '@Components/reducers/stockoverview';

import {
  EarningsActualTable,
} from './components/actual';
import {
  EarningsEstimatesTable,
} from './components/estimates';

export const Earnings = (props) => {
  const {
    state,
  } = useStockOverview();

  const {
    earnings,
  } = state;

  if (!earnings) {
    return null;
  }

  return (
    <>
      <ComponentWrapper>
        <EarningsActualTable />
      </ComponentWrapper>
      <ComponentWrapper>
        <EarningsEstimatesTable />
      </ComponentWrapper>
    </>
  );
};
