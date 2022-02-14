import React from 'react';

import {
  ScrollableTable, Row,
} from '@Components/table';
import {
  ComponentWrapper,
} from '@Style';

export const Table = ({
  fundamentals,
}) => {
  const sections = Object.keys(fundamentals.titles);
  const stringWrapper = (val) => parseFloat(val).toLocaleString('en', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const headerRow =
    <Row
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
    </ComponentWrapper>
  );
};

Table.propTypes = {
  fundamentals: PropTypes.shape({
    titles: PropTypes.objectOf(PropTypes.string).isRequired,
    dates: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
};
