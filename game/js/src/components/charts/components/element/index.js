import {
  select,
} from 'd3-selection';
import {
  line,
  arc,
  pie,
} from 'd3-shape';

const buildLine = (baseComponents, constants) => () => {
  select(baseComponents.root)
      .append('path')
      .attr('id', 'chart-line')
      .datum(constants.data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', baseComponents.line);
};

const updateLine = (baseComponents) => () => {
  select('#chart-line')
      .datum(baseComponents.chartData)
      .attr('d', baseComponents.line);
};

export const lineBuilder = (baseComponents, constants) => () => {
  const {
    xGetter,
    yGetter,
  } = constants;
  const [
    x, y,
  ] = baseComponents.axis;

  const dLine = line()
      .x((d)=> x(xGetter(d)))
      .y((d) => y(yGetter(d)));
  baseComponents.line = dLine;
  return (action) =>
    action == 'build' ?
    buildLine(baseComponents, constants) :
    updateLine(baseComponents);
};

const updateArc = (baseComponents, constants) => () => {
  select(baseComponents.root)
    .selectAll("g.slice")
    .remove()

  select(baseComponents.root)
    .selectAll("g.slice")
    .data(baseComponents.pie)
    .enter()
    .append("svg:g")
    .attr("class", "slice")
    .append("svg:path")
    .attr("fill", (d, i) => constants.colour[i])
    .attr("d", baseComponents.arc);
}

const buildArc = (baseComponents, constants) => () => {
  select(baseComponents.root)
    .attr("transform", "translate(80,90)")
    .selectAll("g.slice")
    .data(baseComponents.pie)
    .enter()
    .append("svg:g")
    .attr("class", "slice")
    .append("svg:path")
    .attr("fill", (d, i) => constants.colour[i])
    .attr("d", baseComponents.arc);
}

export const arcBuilder = (baseComponents, constants) => () => {

  const {
    radius,
  } = constants;

  const carc = arc()
    .innerRadius(0)
    .outerRadius(radius);

  baseComponents.arc = carc;
  return (action) =>
    action == "build" ?
      buildArc(baseComponents, constants) :
      updateArc(baseComponents, constants)

}

/*
 * Hook doesn't do anything but this is included to
 * preserve the API across elements
 */
const buildPie = (baseComponents, constants) => () => {}
const updatePie = (baseComponents, constants) => () => {
  const {
    valueGetter,
    data,
  } = constants;
  console.log("updating pie")
  const cpie = pie()(data.map(valueGetter));
  console.log(data.map(valueGetter));
  baseComponents.pie = cpie;
}

export const pieBuilder = (baseComponents, constants) => () => {

  const {
    valueGetter,
    data,
  } = constants;

  const cpie = pie()(data.map(valueGetter));

  baseComponents.pie = cpie;
  return (action) =>
    action == "build"
      ? buildPie(baseComponents, constants)
      : updatePie(baseComponents, constants)
}
