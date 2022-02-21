import React from 'react';

import {
  ComponentWrapper,
  DefaultHorizontalSpacer,
} from '@Style';
import {
  strConverter,
} from '@Helpers';
import {
  TearSheet,
} from '@Components/tearsheet';
import {
  useStockOverview,
} from '@Components/reducers/stockoverview';

import {
  Header,
} from './components/header';

export const Summary = (props) => {
  const {
    state,
  } = useStockOverview();

  const {
    summary,
  } = state;


  if (!summary) {
    return null;
  }

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
    <>
      <ComponentWrapper>
        <Header
          { ...summary } />
      </ComponentWrapper>
      <ComponentWrapper>
        <DefaultHorizontalSpacer>
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
        </DefaultHorizontalSpacer>
      </ComponentWrapper>
      <ComponentWrapper>
        <DefaultHorizontalSpacer>
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
        </DefaultHorizontalSpacer>
      </ComponentWrapper>
    </>
  );
};
