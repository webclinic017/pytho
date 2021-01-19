import React from 'react';
import {
  render,
} from 'react-dom';

import {
  DemeterApp,
} from './containers/demeter';

const demeterEl = document.getElementById('demeter');
render(<DemeterApp/>, demeterEl);
