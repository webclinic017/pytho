import React from 'react';

import {
  useSimulation,
} from '@Components/reducers/simulation';

import {
  Text,
} from '@Common';

/*
           real
count 10000.000
mean   1195.551
std    1377.029
min      38.570
25%     511.660
50%     835.849
75%    1372.775
max   40154.308
*/

export const Comparison = (props) => {
  const {
    state,
  } = useSimulation();

  const {
    position,
    hasNextStep,
    simResults,
  } = state;

  if (!hasNextStep) {
    let str = '';

    const value = position == 0 ? 100 : simResults.values.slice(-1)[0];
    if (value < 511) str = 'Below 25th percentile';
    else if (value < 835) str = '25-50th percentile';
    else if (value < 1372) str = '50-75th percentile';
    else str = 'Above 75th percentile';
    return (
      <Text>
        {str}
        {' '}
        versus 10k simulations of 60/60 allocation
      </Text>
    );
  } else {
    return null;
  }
};
