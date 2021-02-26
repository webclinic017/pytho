import {
  select,
} from 'd3-selection';
import {
  line,
} from 'd3-shape';

export const lineBuilder = (baseComponents, constants) => () => {
  const tParser = constants.tParser;
  const [
    x, y,
  ] = baseComponents.axis;
  const dLine = line()
      .x((d) => x(tParser(d.date)))
      .y((d) => y(d.close));
  baseComponents.line = dLine;
};

export const buildLine = (baseComponents, constants) => () => {
  select(baseComponents.root)
      .append('path')
      .attr('id', 'chart-line')
      .datum(constants.data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', baseComponents.line);
};

export const updateLine = (baseComponents) => () => {
  select('#chart-line')
      .datum(baseComponents.chartData)
      .attr('d', baseComponents.line);
};

