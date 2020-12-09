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
  Buttons,
} from './buttons';
import {
  Form,
} from './form';

const RiskAttribution = (props) => (
  <div
    id="riskattribution-main">
    <Form />
    <Buttons />
    <ModelDefinition />
    <ModelResults />
    <ExplainRiskAttr />
  </div>
);


export const RiskAttributionApp = (props) => (
  <ModelProvider>
    <RiskAttribution
      { ...props } />
  </ModelProvider>
);
