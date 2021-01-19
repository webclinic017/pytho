import React from 'react';
import {
  render,
} from 'react-dom';

import {
  AthenaApp,
} from './containers/athena';

const athenaEl = document.getElementById('athena');

render(<AthenaApp />, athenaEl);
