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

export const EarningsEstimatesTable = (props) => {
  const {
    state,
  } = useStockOverview();

  const {
    earnings,
  } = state;

  const actualYears = earnings.eps_est_dates.map(
      (date) => date.substring(0, 4));
  const actualDayMonth = earnings.eps_est_dates.map(
      (date) => date.substring(5));
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

  const bodyData = [
    earnings.eps_est_period,
    earnings.eps_est_avg,
    earnings.eps_est_trend_thirty,
    earnings.eps_est_trend_ninety,
    earnings.eps_est_year_ago,
    earnings.eps_est_analyst_no,
  ];

  const bodyTitles = [
    'Period',
    'Est',
    '30 day -',
    '90 day -',
    '1 yr -',
    '#',
  ];
  const bodyRows = bodyData.map((series, i) => {
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
        Earnings Estimates
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
