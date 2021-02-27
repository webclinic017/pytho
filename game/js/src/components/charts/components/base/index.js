import React, {
  useContext, useEffect,
} from 'react';
import {
  select,
} from 'd3-selection';
import PropTypes from 'prop-types';

import {
  ChartContext,
} from '../container';

/*
 * Basic functionality of Chart is wrapped around the dispatching of events,
 * this should allows us to add/remove functions as required. Chart just
 * subscribes and can choose to ignore events when necessary.
 */
export const BaseChart = ({
  events, dispatchers, dispatcher, size,
}) => {
  const context = useContext(ChartContext);
  const {
    ref,
  } = context;
  const {
    width,
    height,
    margin,
  } = size;

  useEffect(() => {
    select(ref.current)
        .append('svg')
        .attr('id', 'chart-container')
        .attr('viewBox', [
          0,
          0,
          width+margin.left+margin.right,
          height+margin.top+margin.bottom,
        ])
        .append('g')
        .attr('id', 'chart-wrapper')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    events.map((e) => {
      dispatcher.on(e, dispatchers[e]);
    });

    dispatcher.call('start');
  }, [
  ]);

  return <div
    ref={ ref } />;
};

BaseChart.propTypes = {
  events: PropTypes.array.isRequired,
  dispatcher: PropTypes.object.isRequired,
  dispatchers: PropTypes.object.isRequired,
  size: PropTypes.object.isRequired,
};
