import { Box, Button } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import {
  select,
  line,
  curveCardinal,
  axisBottom,
  scaleLinear,
  axisRight,
} from "d3";

const Second = ({}) => {
  const svgRef = useRef();
  const [data, setData] = useState([25, 30, 45, 50, 20, 75, 60]);
  useEffect(() => {
    const svg = select(svgRef.current);
    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([0, 300]);
    const yScale = scaleLinear().domain([0, 150]).range([150, 0]);
    //   const colorExtent = extent(data, (d) => d);
    //   console.log(colorExtent);
    //   const colorScale = scaleSequential(interpolateMagma);
    //   console.log("color scale: ", colorScale(25));
    const xAxis = axisBottom(xScale)
      .ticks(data.length - 1)
      .tickFormat((_, index) => `${index + 1}`);
    const yAxis = axisRight(yScale);
    svg.select(".x-axis").style("transform", "translateY(150px)").call(xAxis);
    svg.select(".y-axis").style("transform", "translateX(300px)").call(yAxis);

    const myLine = line()
      .x((_value, index) => xScale(index))
      .y(yScale as any)
      .curve(curveCardinal);
    svg
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("d", myLine as any)
      .attr("fill", "none")
      .attr("class", "line")
      .attr("stroke", "blue");
    // svg
    //   .selectAll("circle")
    //   .data(data)
    //   .join("circle")
    //   .attr("r", (value) => value)
    //   .attr("cx", (value) => value * 2)
    //   .attr("cy", (value) => value * 3)
    //   .attr("stroke", "red");
  }, [data]);

  return (
    <Box mt={4}>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
      <Box mt={4}>
        <Button
          colorScheme="green"
          onClick={() => {
            setData(data.map((d) => d + 5));
          }}
        >
          Update Data
        </Button>
        <Button
          colorScheme="red"
          onClick={() => {
            setData(data.map((d) => (d < 35 ? d : 0)));
          }}
        >
          Filter Data
        </Button>
      </Box>
    </Box>
  );
};

export default Second;
