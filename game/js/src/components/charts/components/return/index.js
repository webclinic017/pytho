import {
  select,
} from 'd3-selection';

import {
  returnCalculator,
} from '../../helpers';

export const buildReturn = (baseComponents, constants) => () => {
  const periodReturn = returnCalculator(constants.data);

  select(baseComponents.root)
      .append('text')
      .attr('id', 'chart-periodperf')
      .attr('x', 10)
      .attr('y', 10)
      .attr('fill', 'var(--default-text-color)')
      .attr('dy', '.15em')
      .text((d) => `Period return: ${periodReturn}%`);
};

export const updateReturn = (baseComponents) => () => {
  const periodReturn = returnCalculator(baseComponents.chartData);

  select('#chart-periodperf')
      .text((d) => `Period return: ${periodReturn}%`);
};

