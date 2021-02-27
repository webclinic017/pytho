import React from 'react';

import {
  selectAll,
} from 'd3-selection';

export const addButtonHook = (constants) => () => {
  selectAll('.chart-timebutton-element')
      .on('click', (e) =>
        constants.dispatcher.call('timebutton', undefined, e.target.name));
};

export const TimeButtons = (props) => {
  const titles = [
    '1m',
    '3m',
    '6m',
    '12m',
    'Max',
  ];
  return (
    <div
      id="chart-timebutton-wrapper">
      {
        titles.map((t, i) => (
          <button
            className="chart-timebutton-element"
            name={ t }
            key={ i }>
            {t}
          </button>
        ))
      }
    </div>
  );
};
