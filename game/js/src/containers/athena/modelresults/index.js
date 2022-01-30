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

  if (core != undefined && bootstrap != undefined && rolling != undefined) {
    return (
      <Panel
        data-testid="riskattribution-modelresults">
        <CoreResultComponent
          results={ results }
          independent={ independent }
          dependent={ dependent } />
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
