import React from 'react';

import {
  ScrollableTable, Row,
} from '@Components/table';
import {
  Title,
} from '@Common';
import {
  DefaultHorizontalSpacer,
} from '@Style';
import {
  useStockOverview,
} from '@Components/reducers/stockoverview';

export const ActualEarnings = (props) => {
  const {
    state,
  } = useStockOverview();

  const {
    earnings,
  } = state;

  if (earnings == null) {
    return null;
  }

  /* Actual EPS date contains some values for next q and next year,
  so we need to drop nulls. Way below is N rather than N*number of
  rows. Should be 2 or 3 nulls but this way is guaranteed.
  */
  const actualEpsLen = earnings.eps_actual.length;
  const actualEpsValueLen = earnings.eps_actual.filter((v) => v!= -1).length;
  const startIndex = actualEpsLen - actualEpsValueLen;
  const endIndex = actualEpsLen - 1;

  const actualDates = earnings.eps_dates_period.slice(startIndex, endIndex);
  const actualEps = earnings.eps_actual.slice(startIndex, endIndex);
  const actualEst = earnings.eps_est.slice(startIndex, endIndex);
  const actualDiff = earnings.eps_diff.slice(startIndex, endIndex);

  const actualYears = actualDates.map((date) => date.substring(0, 4));
  const actualDayMonth = actualDates.map((date) => date.substring(5));
  const dateTitles = [
    'Year',
    'Date',
  ];

  const headerRows = [
    actualYears,
    actualDayMonth,
  ].map((dates, i) => {
    const title = dateTitles[i];
    return (
      <Row
        key={ i }
        values={ dates }
        title={ title } />
    );
  });

  const bodyTitles= [
    'Act',
    'Est',
    'Diff',
  ];
  const bodyRows = [
    actualEps,
    actualEst,
    actualDiff,
  ].map((series, i) => {
    const title = bodyTitles[i];
    return (
      <React.Fragment
        key={ i }>
        <Row
          title={ title }
          values={ series } />
      </React.Fragment>
    );
  });

  const overlayHeaders = [
    actualYears,
    actualDayMonth,
  ].map((dates, i) => {
    const title = dateTitles[i];
    return (
      <Row
        key={ i }
        title={ title } />
    );
  });

  const overlayBody = bodyTitles.map((title, i) => {
    return (
      <React.Fragment
        key={ i }>
        <Row
          title={ title } />
      </React.Fragment>
    );
  });

  return (
    <>
      <Title
        light>
        Actual Earnings
      </Title>
      <DefaultHorizontalSpacer>
        <ScrollableTable
          headerRows={ headerRows }
          bodyRows={ bodyRows }
          overlayHeader={ overlayHeaders }
          overlayBody={ overlayBody } />
      </DefaultHorizontalSpacer>
    </>
  );
};
