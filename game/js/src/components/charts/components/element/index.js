import {
  select,
} from 'd3-selection';
import {
  line,
  area,
} from 'd3-shape';
import {
  timeParse,
} from 'd3-time-format';

export const lineBuilder = (axis) => {
  const tParser = timeParse('%d/%m/%Y');
  const [
    x, y,
  ] = axis;
  return line()
      .x((d) => x(tParser(d.date)))
      .y((d) => y(d.close));
};

export const buildLine = (root, line, data) => {
  select(root)
      .append('path')
      .attr('id', 'chart-line')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);
};

export const updateLine = (root, line, data) => {
  select(root)
      .datum(data)
      .attr('d', line);
};

export const buildArea = (root, area, data) => {
  select(root)
      .append('path')
      .attr('id', 'chart-area')
      .datum(data)
      .attr('fill', 'steelblue')
      .attr('d', area);
};

export const updateArea = (root, area, data) => {
  select(root)
      .datum(data)
      .attr('d', area);
};

export const areaBuilder = (axis) => {
  const tParser = timeParse('%d/%m/%Y');
  const [
    x, y,
  ] = axis;
  return area()
      .x((d) => x(tParser(d.date)))
      .y1((d) => y(d.close))
      .y0(y(0));
};

