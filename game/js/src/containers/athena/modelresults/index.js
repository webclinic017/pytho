import React from 'react';

import {
  useModel,
} from '@Components/reducers/riskattribution';
import {
  Panel,
} from '@Components/common';

import {
  renderCoreDependent,
  renderCoreIndependent,
  renderBootstrapDependent,
  renderBootstrapIndependent,
  DrawdownEstimatorResults,
} from './components/modelcomponents';
import {
  RollingAlphaBarChart,
  RollingCoefBarChart,
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
    core, bootstrap, rolling, dates, drawdown,
  } = results;

  if (core != undefined && core.intercept != undefined) {
    return (
      <Panel
        data-testid="riskattribution-modelresults">
        {renderCoreDependent(core, dependent)}
        {
          Object.entries(core.coef).map((v) => {
            const independentObj = independent[v[0]];
            const avgObj = core.avgs.ind[v[0]];
            return renderCoreIndependent(
                v[1], avgObj, independentObj);
          })
        }
      </Panel>
    );
  } else if (bootstrap != undefined) {
    return (
      <Panel
        data-testid="riskattribution-modelresults">
        {renderBootstrapDependent(bootstrap.ind, dependent)}
        {
          Object.entries(bootstrap.dep).map((v) => {
            const independentObj = independent[v[0]];
            return renderBootstrapIndependent(
                v[1], independentObj);
          })
        }
      </Panel>
    );
  } else if (rolling != undefined) {
    return (
      <Panel
        data-testid="riskattribution-modelresults">
        <RollingAlphaBarChart
          data={ rolling }
          dates={ dates } />
        <RollingCoefBarChart
          data={ rolling }
          independent={ independent }
          dates={ dates } />
      </Panel>
    );
  } else if (drawdown != undefined) {
    return (
      <Panel
        data-testid="riskattribution-modelresults">
        <DrawdownEstimatorResults
          drawdown={ drawdown } />
      </Panel>
    );
  }

  return null;
};
