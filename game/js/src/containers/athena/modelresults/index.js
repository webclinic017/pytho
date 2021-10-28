import React from 'react';

import {
  useModel,
} from '@Components/reducers/riskattribution';
import {
  Panel,
} from '@Components/common';

import {
  CoreResultComponent,
} from './components/core';
import {
  BootstrapResultComponent,
} from './components/bootstrap';
import {
  DrawdownEstimatorResults,
} from './components/drawdown';
import {
  RollingAlphaLineChart,
  RollingCoefsLineChart,
} from './components/rollingchart';

export const ModelResults = (props) => {
  const {
    state,
  } = useModel();
  const {
    results,
    independent,
    dependent,
  } = state;
  const {
    core, bootstrap, rolling, drawdown,
  } = results;

  if (core != undefined) {
    return (
      <Panel
        data-testid="riskattribution-modelresults">
        <CoreResultComponent
          results={ core }
          independent={ independent }
          dependent={ dependent } />
      </Panel>
    );
  } else if (bootstrap != undefined) {
    return (
      <Panel
        data-testid="riskattribution-modelresults">
        <BootstrapResultComponent
          results={ bootstrap }
          independent={ independent }
          dependent={ dependent } />
      </Panel>
    );
  } else if (rolling != undefined) {
    return (
      <Panel
        data-testid="riskattribution-modelresults">
        <RollingAlphaLineChart
          data={ rolling } />
        <RollingCoefsLineChart
          data={ rolling }
          independent={ independent } />
      </Panel>
    );
  } else if (drawdown != undefined) {
    return (
      <Panel
        data-testid="riskattribution-modelresults">
        <DrawdownEstimatorResults
          results={ drawdown }
          independent={ independent }
          dependent={ dependent } />
      </Panel>
    );
  }

  return null;
};
