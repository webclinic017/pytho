import React, { useEffect } from 'react';
import { select } from 'd3-selection';
import { extent, max } from 'd3-array';
import { scaleLinear, scaleTime } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { line } from 'd3-shape';

export const Chart = props => {

  const margin = {
    top:10,
    right:30,
    bottom:30,
    left:60,
  };
  const width = 460 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const myRef = React.createRef();
  
  const testData = [
    {date: 4000, value:100}, 
    {date: 4001, value:200}
  ]

  const main = () => {
    const svg = select(myRef.current)
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = scaleTime()
      .domain(extent(testData, d=> d.date))
      .range([0, width]);

    const y = scaleLinear()
      .domain([0, max(testData, d => d.value)])
      .range([height, 0])

    const dLine = line()
      .x(d => x(d.date))
      .y(d => y(d.value))
   
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(axisBottom(x))

    svg.append("g")
      .call(axisLeft(y))

    svg.append("path")
      .datum(testData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", dLine)
  }

  useEffect(() => {
    main()
  })

  return (
    <div>
      <div ref={myRef} />
    </div>
  )

}
