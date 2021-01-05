import React from 'react';
import {
  render,
} from 'react-dom';

import {
  BacktestApp,
} from './components/backtest';

const backtestEl = document.getElementById('backtest-app');

render(<BacktestApp />, backtestEl);
