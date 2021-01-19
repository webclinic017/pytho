import React from 'react';
import {
  render,
} from 'react-dom';

import {
  AphroditeApp,
} from './containers/aphrodite';

const aphroditeEl = document.getElementById('aphrodite');

render(<AphroditeApp />, aphroditeEl);
