import React from 'react';

import {
  selectAll,
} from 'd3-selection';

import {
  Button,
} from '@Style';

export const addButtonHook = (dispatch) => {
  selectAll('.chart-logbutton-element')
      .on('click', (e) => dispatch({
        type: 'logButtonPress',
      }));
};

export const LogButton = (props) => {
  return (
    <Button
      className="chart-logbutton-element">
      Log
    </Button>
  );
};
