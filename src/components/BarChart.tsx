import { Box } from "@chakra-ui/react";
import {
  axisBottom,
  axisRight,
  interpolatePiYG,
  interpolateTurbo,
  scaleBand,
  scaleLinear,
  scaleSequential,
  select,
} from "d3";
import React, { useEffect, useRef } from "react";
import useResizeObserver from "../utils/useResizeObserver";

interface BarChartProps {
  data: number[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  const roundXCoordinate = (
    xCoordinate: number,
    bandwidth: number,
    xScaled: number[]
  ) => {
    for (let i = 0; i < xScaled.length; i++) {
      if (Math.abs(xCoordinate - xScaled[i]) <= bandwidth) {
        return xScaled[i];
      }
    }
  };
  useEffect(() => {
    const svg = select(svgRef.current);
    console.log(dimensions);
    if (!dimensions) return;

    const xScale = scaleBand()
      .domain(data.map((_, index) => index) as Iterable<string>)
      .range([0, dimensions.width])
      .padding(0.5);
    const yScale = scaleLinear().domain([0, 150]).range([dimensions.height, 0]);
    const colorScale = scaleSequential([0, 150], interpolateTurbo);
    const xScaled = data.map((_, i) => xScale(i));

    const xAxis = axisBottom(xScale).ticks(data.length - 1);
    const yAxis = axisRight(yScale);
    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(xAxis);
    svg
      .select(".y-axis")
      .style("transform", `translateX(${dimensions.width}px)`)
      .call(yAxis);

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .style("transform", "scale(1, -1)")
      .attr("x", (_, index) => xScale(index))
      .attr("y", -dimensions.height)
      .attr("width", xScale.bandwidth())
      .on("mouseenter", (event, d) => {
        svg
          .selectAll(".tooltip")
          .data([d])
          .join("text")
          .attr("class", "tooltip")
          .text(d)
          .attr(
            "x",
            roundXCoordinate(event.layerX, xScale.bandwidth(), xScaled) +
              xScale.bandwidth() / 2
          )
          .attr("y", yScale(d) - 8)
          .attr("text-anchor", "middle")
          .transition()
          .attr("opacity", 1);
      })
      .on("mouseleave", () => svg.select(".tooltip").remove())

      // .on("mouseenter", (event, d) => {
      //   console.log("event: ", event);
      //   console.log("d: ", d);
      // })
      .transition()
      .attr("fill", colorScale)
      .attr("height", (value) => dimensions.height - yScale(value));
  }, [data, dimensions]);

  return (
    <>
      <div ref={wrapperRef}>
        <Box width="100%">
          <svg ref={svgRef}>
            <g className="x-axis" />
            <g className="y-axis" />
          </svg>
        </Box>
      </div>
    </>
  );
};

export default BarChart;
