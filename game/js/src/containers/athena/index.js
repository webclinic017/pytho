import React from 'react';

import {
  ModelProvider,
} from '@Components/reducers/riskattribution';

import {
  ModelDefinition,
} from './modeldefinition';
import {
  ModelResults,
} from './modelresults';
import {
  ExplainRiskAttr,
} from './explain';
import {
  Builder,
} from './builder';

const Athena = (props) => (
  <div
    id="riskattribution-main">
    <Builder />
    <ModelDefinition />
    <ModelResults />
    <ExplainRiskAttr />
  </div>
);


export const AthenaApp = (props) => (
  <ModelProvider>
    <Athena
      { ...props } />
  </ModelProvider>
);
