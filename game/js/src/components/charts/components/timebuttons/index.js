import React from 'react';

import {
  selectAll,
} from 'd3-selection';

export const addButtonHook = (constants) => () => {
  selectAll('.chart-timebutton-element')
      .on('click', (e) =>
        constants.dispatcher.call('timebutton', undefined, e.target.name));
};


export const timeButtonUpdater = (period, {
  data, xGetter, yGetter, tParser,
}) => {
  const monthlyTradingDays = 21;
  const lastNDays = (days) =>
    data.slice(Math.max(data.length - days, 1));

  let filteredData = [
  ];
  let value = [
  ];
  const parseDates = (data) => [
    xGetter(data[0]), xGetter(data[data.length -1]),
  ];

  if (period == '1m') {
    filteredData = lastNDays(monthlyTradingDays);
    value = parseDates(filteredData);
  } else if (period == '3m') {
    filteredData = lastNDays(monthlyTradingDays*3);
    value = parseDates(filteredData);
  } else if (period == '6m') {
    filteredData = lastNDays(monthlyTradingDays*6);
    value = parseDates(filteredData);
  } else if (period == '12m') {
    filteredData = lastNDays(monthlyTradingDays*12);
    value = parseDates(filteredData);
  } else if (period == 'Max') {
    filteredData = data;
    value = parseDates(filteredData);
  }

  return {
    xValues: value,
  };
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
