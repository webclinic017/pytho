import React from 'react';
import {
  render,
} from 'react-dom';

import {
  RiskAttributionApp,
} from './components/riskattribution';

const riskAttributionEl = document.getElementById('riskattribution-app');
render(<RiskAttributionApp />, riskAttributionEl);
