import React from 'react';

import {
  useStockOverview,
} from '@Components/reducers/stockoverview';
import {
  ScrollableTable, Row,
} from '@Components/table';
import {
  ComponentWrapper,
  DefaultHorizontalSpacer,
} from '@Style';

export const Fundamentals = (props) => {
  const {
    state,
  } = useStockOverview();

  const {
    fundies: fundamentals,
  } = state;

  if (!fundamentals) {
    return null;
  }

  const sections = Object.keys(fundamentals.titles);
  const stringWrapper = (val) => parseFloat(val).toLocaleString('en', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const headerRow =
    <Row
      key={ 0 }
      values={ fundamentals.dates.map((v) => v.substring(0, 4)) }
      title={ 'Date' } />;

  const bodyRows = sections.map((s, i)=> {
    const section = fundamentals.titles[s];
    const names = Object.keys(section);
    const rows = names.map((n, i) => <Row
      key={ i }
      isSubSection
      values={ fundamentals[n].map(stringWrapper) }
      title={ section[n] } />);
    return (
      <React.Fragment
        key={ i }>
        <Row
          title={ s } />
        {rows}
      </React.Fragment>
    );
  });

  const overlayHeader = <Row
    key={ 0 }
    title={ 'Date' } />;

  const overlayBody = sections.map((s, i) => {
    const section = fundamentals.titles[s];
    const names = Object.keys(fundamentals.titles[s]);
    const rows = names.map((n, i) => <Row
      key={ i }
      isSubSection
      title={ section[n] } />);
    return (
      <React.Fragment
        key={ i }>
        <Row
          title={ s } />
        {rows}
      </React.Fragment>
    );
  });

  return (
    <ComponentWrapper>
      <DefaultHorizontalSpacer>
        <ScrollableTable
          headerRows={
            [
              headerRow,
            ]
          }
          bodyRows={ bodyRows }
          overlayHeader={
            [
              overlayHeader,
            ]
          }
          overlayBody={ overlayBody } />
      </DefaultHorizontalSpacer>
    </ComponentWrapper>
  );
};
