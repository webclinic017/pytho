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
  Earnings,
} from './components/earnings';

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
          <Earnings />
        </SectionWrapper>
      </PageWrapper>
    </StockOverviewProvider>
  );
};
