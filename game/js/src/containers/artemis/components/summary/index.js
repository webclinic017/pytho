import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import {
  ComponentWrapper,
} from '@Style';
import {
  strConverter,
} from '@Helpers';
import {
  TearSheet,
} from '@Components/tearsheet';

import {
  Header,
} from './components/header';

const Wrapper = styled.div`
  margin: 2rem 0;
`;


const BasicInfo = ({
  summary,
}) => {
  const tearSheetCoreTitles = [
    'Market Cap',
    'Shares out',
  ];

  const tearSheetCoreValues = [
    () => parseFloat(summary.market_cap).toLocaleString('en', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' m',
    () => parseFloat(summary.shares_outstanding/1000000).toLocaleString('en', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' b',
  ];

  const tearSheetSectorTitles = [
    'GIC Sector',
    'GIC SubIndustry',
  ];

  const tearSheetSectorValues = [
    () => summary.gic_sector,
    () => summary.gic_sub_industry,
  ];

  const tearSheetEarningsTitles = [
    'EPS Lst',
    'EPS Curr',
    'P/E',
    'Fwd P/E',
    'Div Yld',
    'Last Report',
  ];

  const tearSheetEarningsValues = [
    () => strConverter(summary.eps_trail),
    () => strConverter(summary.eps_fwd_est),
    () => strConverter(summary.pe_trail),
    () => strConverter(summary.fwd_pe),
    () => strConverter(summary.divi_yld) + ' %',
    () => strConverter(summary.last_q_date),
  ];

  const tearSheetInsiderTitles = [
    'Insider Held',
    'Inst Held',
  ];

  const tearSheetInsiderValues = [
    () => strConverter(summary.shares_insider) + ' %',
    () => strConverter(summary.shares_inst) + ' %',
  ];

  return (
    <Wrapper>
      <Header
        { ...summary } />
      <TearSheet
        titles={
          [
            tearSheetCoreTitles,
            tearSheetSectorTitles,
          ]
        }
        stats={
          [
            tearSheetCoreValues,
            tearSheetSectorValues,
          ]
        } />
      <TearSheet
        titles={
          [
            tearSheetEarningsTitles,
            tearSheetInsiderTitles,
          ]
        }
        stats={
          [
            tearSheetEarningsValues,
            tearSheetInsiderValues,
          ]
        } />
    </Wrapper>
  );
};

BasicInfo.propTypes = {
  summary: PropTypes.shape({
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    exchange: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    market_cap: PropTypes.number.isRequired,
    shares_outstanding: PropTypes.number.isRequired,
    gic_sector: PropTypes.string.isRequired,
    gic_sub_industry: PropTypes.string.isRequired,
    eps_trail: PropTypes.number.isRequired,
    eps_fwd_est: PropTypes.number.isRequired,
    pe_trail: PropTypes.number.isRequired,
    fwd_pe: PropTypes.number.isRequired,
    divi_yld: PropTypes.number.isRequired,
    last_q_date: PropTypes.string.isRequired,
    shares_insider: PropTypes.number.isRequired,
    shares_inst: PropTypes.number.isRequired,
  }).isRequired,
};

export const Summary = (props) => {
  return (
    <ComponentWrapper>
      <BasicInfo
        { ...props } />
    </ComponentWrapper>
  );
};
