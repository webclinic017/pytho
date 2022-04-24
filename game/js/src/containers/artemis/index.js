import React from 'react';

import {
  PageWrapper,
  SectionWrapper,
} from '@Style';
import {
  StockOverviewProvider,
} from '@Components/reducers/stockoverview';

import {
  EquitySearch,
} from './components/equitysearch';
import {
  Summary,
} from './components/summary';
import {
  PriceChart,
} from './components/pricechart';
import {
  Fundamentals,
} from './components/fundamentals';
import {
  ActualEarnings,
} from './components/actualearnings';
import {
  EstimateEarnings,
} from './components/estimateearnings';

export const ArtemisApp = (props) => {
  return (
    <StockOverviewProvider>
      <PageWrapper>
        <SectionWrapper>
          <EquitySearch />
        </SectionWrapper>
        <SectionWrapper>
          <Summary />
        </SectionWrapper>
        <SectionWrapper>
          <PriceChart />
        </SectionWrapper>
        <SectionWrapper>
          <Fundamentals />
        </SectionWrapper>
        <SectionWrapper>
          <ActualEarnings />
        </SectionWrapper>
        <SectionWrapper>
          <EstimateEarnings />
        </SectionWrapper>
      </PageWrapper>
    </StockOverviewProvider>
  );
};
