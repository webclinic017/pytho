import React from 'react';
import {
  render,
} from 'react-dom';

import {
  HermesApp,
} from './containers/hermes';

const hermesEl = document.getElementById('hermes');
render(<HermesApp />, hermesEl);
