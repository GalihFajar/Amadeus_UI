import { Box, useInterval } from "@chakra-ui/react";
import {
  axisBottom,
  axisRight,
  extent,
  interpolateReds,
  scaleBand,
  scaleLinear,
  scaleSequential,
  select,
} from "d3";
import React, { useEffect, useRef, useState } from "react";
import { generateHorizontalSegmentMap } from "../constants/constants";
import { circleType, areas } from "../constants/types";
import { isCollide } from "../utils/isCollide";
import makeArea from "../utils/makeArea";
import recordCollision from "../utils/recordCollision";
import { updateCoordinate } from "../utils/updateCoordinate";
import useResizeObserver from "../utils/useResizeObserver";

interface SvgAreaCircleProps {
  circle: circleType[];
}

export const SvgAreaCircle: React.FC<SvgAreaCircleProps> = ({
  circle: initialCircle,
}) => {
  const wrapperRef = useRef();
  const clipPathRef = useRef();
  const svgRef = useRef();
  const tooltipRef = useRef();
  const areaTooltipRef = useRef();
  const dimensions: DOMRectReadOnly = useResizeObserver(wrapperRef);
  const [circle, setCircle] = useState(initialCircle);
  const circleSize = 20;
  const horizontalSegment = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const horizontalSegmentAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const verticalSegment = [1, 2, 3, 4, 5];
  const verticalSegmentAxis = [1, 2, 3, 4];
  const [areas, setAreas] = useState(
    makeArea(horizontalSegmentAxis, verticalSegmentAxis)
  );
  const horizontalSegmentMap = generateHorizontalSegmentMap(
    horizontalSegment.length
  );

  useEffect(() => {
    if (!dimensions) return;
    const clipPath = select(clipPathRef.current);
    clipPath
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", dimensions.width)
      .attr("width", dimensions.width)

      .attr("stroke", "black")
      .style("fill", "none")
      .style("stroke-width", 0.3);
  }, [dimensions]);
  useEffect(() => {
    const svg = select(svgRef.current);
    const tooltip = select(tooltipRef.current);

    svg
      .selectAll(".circle")
      .data(circle)
      .join("circle")
      .attr("class", "circle")
      .style("clip-path", "url(#clipPath)")
      .on("mouseenter", (_, d) => {
        console.log("d: ", d);
        tooltip
          .selectAll(".tooltip-rect")
          .data([d])
          .join("rect")
          .attr("class", "tooltip-rect")
          .attr("x", d.x)
          .attr("y", d.y - 2 * d.radius)
          .attr("height", 2 * d.radius)
          .attr("width", 2 * 2.5 * d.radius)
          .attr("fill", "white")
          .attr("stroke", "black");
        tooltip.raise();
        tooltip
          .selectAll(".tooltip-text")
          .data([d])
          .join("text")
          .text(d.id)
          .attr("class", "tooltip-text")
          .attr("x", d.x + 2.5 * d.radius)
          .attr("y", d.y - d.radius)
          .attr("text-anchor", "middle")
          .transition()
          .attr("opacity", 1);
      })
      .on("mouseleave", () => {
        svg.select(".tooltip-text").remove();
        svg.select(".tooltip-rect").remove();
      })
      .transition()
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", circleSize)
      .attr("stroke", "black")
      .attr("fill", "green")
      .attr("fill", (d) => {
        return d.isCollide ? "red" : "green";
      });
  }, [circle, dimensions]);

  useEffect(() => {
    if (!dimensions) return;
    const svg = select(svgRef.current);
    const xScale = scaleBand()
      .domain(horizontalSegmentAxis.map((d, _i) => d) as Iterable<string>)
      .range([0, dimensions.width]);
    const xScaleLinear = scaleLinear()
      .domain(extent(horizontalSegment))
      .range([0, dimensions.width]);
    const yScale = scaleBand()
      .domain(verticalSegmentAxis.map((d, _i) => d) as Iterable<string>)
      .range([0, dimensions.height]);
    const yScaleLinear = scaleLinear()
      .domain(extent(verticalSegment))
      .range([0, dimensions.height]);

    const xAxis = axisBottom(xScale)
      .ticks(horizontalSegment.length)
      .tickFormat((domain, _index) => {
        return `${horizontalSegmentMap[domain as any]}`;
      })
      .tickSizeOuter(0)
      .tickSizeInner(0)
      .tickPadding(5);
    const yAxis = axisRight(yScale)
      .ticks(verticalSegment.length)
      .tickSizeOuter(0)
      .tickSizeInner(0)
      .tickPadding(5);
    const verticalGrid = axisBottom(xScaleLinear)
      .ticks(horizontalSegment.length)
      .tickSizeInner(-dimensions.height);
    const horizontalGrid = axisRight(yScaleLinear)
      .ticks(verticalSegment.length)
      .tickSizeInner(-dimensions.width);

    const colorScale = scaleSequential([0, 50], interpolateReds);

    const getViolationCoordinates = (
      collisionRecord: Record<number, number[]>,
      circles: circleType[]
    ): { x: number; y: number }[] => {
      const violationCoordinates: { x: number; y: number }[] = [];
      for (let key in collisionRecord) {
        collisionRecord[key].forEach((value) => {
          const avgX = (circles[key].x + circles[value].x) / 2;
          const avgY = (circles[key].y + circles[value].y) / 2;
          violationCoordinates.push({ x: avgX, y: avgY });
        });
      }
      return violationCoordinates;
    };
    const updateAreaViolation = (
      areas: areas,
      violationCoordinates: { x: number; y: number }[]
    ) => {
      const tempAreas = areas;
      violationCoordinates.forEach((c) => {
        for (let i = 0; i < tempAreas.length; i++) {
          if (
            xScale(tempAreas[i].x as any) + xScale.bandwidth() >= c.x &&
            yScale(tempAreas[i].y as any) + yScale.bandwidth() >= c.y
          ) {
            tempAreas[i].violations++;
            i = tempAreas.length;
          }
        }
      });

      return tempAreas;
    };

    const collisionRecord: Record<number, number[]> = recordCollision(circle);
    const violationCoordinates: {
      x: number;
      y: number;
    }[] = getViolationCoordinates(collisionRecord, circle);
    setAreas(updateAreaViolation(areas, violationCoordinates));

    svg
      .selectAll(".area")
      .data(areas)
      .join("rect")
      .attr("class", "area")
      .on("mouseenter", (_, { x, y }) => {
        console.log("area : ", x, y);
      })
      .attr("x", (d) => xScale(d.x as any))
      .attr("y", (d) => yScale(d.y as any))
      .attr("fill", (d) => colorScale(d.violations))
      .attr("stroke", "none")
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .lower();

    svg
      .select(".vertical-grid")
      .style("transform", `translateY(${dimensions.height}px)`)
      .attr("stroke", "grey")
      .attr("opacity", 0.2)
      .call(verticalGrid);
    svg
      .select(".horizontal-grid")
      .style("transform", `translateX(${dimensions.width}px)`)
      .attr("stroke", "grey")
      .attr("opacity", 0.2)
      .call(horizontalGrid);
    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(xAxis);
    svg
      .select(".y-axis")
      .style("transform", `translateX(${dimensions.width}px)`)
      .call(yAxis);

    svg.select(".y-axis").call(yAxis);
  }, [dimensions, circle]);
  useInterval(() => {
    setCircle(() => {
      const temp = circle.map((d) => {
        return updateCoordinate(d, {
          height: dimensions.height,
          width: dimensions.width,
        });
      });
      isCollide(temp);

      return temp;
    });
  }, 1000);

  return (
    <Box w={1024} height={512} ref={wrapperRef}>
      <svg ref={svgRef}>
        <g className="tooltip" ref={tooltipRef}></g>
        <g className="tooltip-area" ref={areaTooltipRef} />
        <clipPath ref={clipPathRef} id="clipPath"></clipPath>
        <g className="vertical-grid" />
        <g className="horizontal-grid" />
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </Box>
  );
};
