import {
  select,
} from 'd3-selection';

import {
  returnCalculator,
} from '../../helpers';

export const buildReturn = (root, data) => {
  const periodReturn = returnCalculator(data);

  select(root)
      .append('text')
      .attr('id', 'chart-periodperf')
      .attr('x', 10)
      .attr('y', 10)
      .attr('fill', 'var(--default-text-color)')
      .attr('dy', '.15em')
      .text((d) => `Period return: ${periodReturn}%`);
};

export const updateReturn = (data) => {
  const periodReturn = returnCalculator(data);

  select('#chart-periodperf')
      .text((d) => `Period return: ${periodReturn}%`);
};

