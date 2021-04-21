import {
  axisBottom,
  axisRight,
  extent,
  interpolateRdYlGn,
  interpolateReds,
  scaleBand,
  scaleLinear,
  scaleSequential,
  select,
} from "d3";
import React, { useEffect, useRef, useState } from "react";
import generateHorizontalSegmentMap from "../constants/constants";
import { CircleType, Areas } from "../constants/types";
import { isCollide } from "../utils/isCollide";
import makeArea from "../utils/makeArea";
import recordCollision from "../utils/recordCollision";
import useResizeObserver from "../utils/useResizeObserver";
import useInterval from "../utils/useInterval";
import getPositions from "../utils/getPositions";

interface SvgAreaCircleProps {
  circle: CircleType[];
}

const SvgAreaCircle: React.FC<SvgAreaCircleProps> = ({
  circle: initialCircle,
}: SvgAreaCircleProps) => {
  const areaHeight = 7;
  const areaWidth = 5;
  const wrapperRef = useRef();
  const clipPathRef = useRef();
  const svgRef = useRef();
  const tooltipRef = useRef();
  // const tooltipCollisionsRef = useRef();
  const areaTooltipRef = useRef();

  const dimensions: DOMRectReadOnly = useResizeObserver(wrapperRef);
  const [circle, setCircle] = useState(initialCircle);
  const circleSize = 30;
  const horizontalSegmentAxis = Array.from(
    { length: areaWidth },
    (_, i) => i + 1
  );
  const verticalSegmentAxis = Array.from(
    { length: areaHeight },
    (_, i) => i + 1
  );
  const horizontalSegment = [
    ...horizontalSegmentAxis,
    horizontalSegmentAxis[horizontalSegmentAxis.length - 1] + 1,
  ];
  const verticalSegment = [
    ...verticalSegmentAxis,
    verticalSegmentAxis[verticalSegmentAxis.length - 1] + 1,
  ];

  // const horizontalSegmentAxis = [1, 2, 3, 4, 5, 6, 7];
  // const verticalSegmentAxis = [1, 2, 3, 4, 5];
  // const horizontalSegment = [1, 2, 3, 4, 5, 6, 7, 8];
  // const verticalSegment = [1, 2, 3, 4, 5, 6];
  const [focusedCircle, setFocusedCircle] = useState<CircleType>(null);
  const [areas, setAreas] = useState(
    makeArea(horizontalSegmentAxis, verticalSegmentAxis)
  );
  const horizontalSegmentMap = generateHorizontalSegmentMap(
    horizontalSegment.length
  );
  const roundToNearest = (input: number, maxNumber: number): number => {
    if (input > maxNumber) {
      return maxNumber;
    }
    if (input < 0) {
      return 0;
    }
    return input;
  };

  useEffect(() => {
    if (!dimensions) return;
    // console.log("dimensions: ", dimensions);
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
    if (!dimensions) return;
    const svg = select(svgRef.current);
    const tooltip = select(tooltipRef.current);
    // const tooltipCollisions = select(tooltipCollisionsRef.current);
    const colorScale = scaleSequential([0, 20].reverse(), interpolateRdYlGn);

    const xScaleLinear = scaleLinear()
      .domain(extent(horizontalSegment))
      .range([0, dimensions.width]);
    const yScaleLinear = scaleLinear()
      .domain(extent(verticalSegment))
      .range([dimensions.height, 0]);
    console.log("yScale: ", yScaleLinear(1));

    svg
      .selectAll(".circle")
      .data(circle)
      .join("circle")
      .attr("class", "circle")
      .style("clip-path", "url(#clipPath)")
      .on("mouseenter", (_, d) => {
        // console.log("d: ", d);
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
      .on("click", (_, c) => {
        console.log(c);
        setFocusedCircle(c);
      })
      .transition()
      .attr("cx", (d) => {
        const tempX: number = roundToNearest(d.x, areaWidth);
        return xScaleLinear(tempX + 1);
      })
      .attr("cy", (d) => {
        const tempY: number = roundToNearest(d.y, areaHeight);
        return yScaleLinear(tempY + 1);
      })
      // .attr("cx", (d) => xScaleLinear(d.x + 1))
      // .attr("cy", (d) => yScaleLinear(d.y + 1))
      .attr("r", (d) => {
        const radius = xScaleLinear(d.x + 1) - xScaleLinear(d.x);
        console.log("radius: ", radius);
        return radius;
      })
      .attr("stroke", "black")
      .transition()
      .attr("fill", (d) => (d.isCollide ? "red" : colorScale(d.collisions)));

    svg
      .selectAll(".tooltipcollisions")
      .data(circle)
      .join("text")
      .attr("class", "tooltipcollisions")
      .text((d) => d.collisions)
      .transition()
      .attr("x", (d) => xScaleLinear(roundToNearest(d.x, areaWidth) + 1))
      .attr("y", (d) => yScaleLinear(roundToNearest(d.y, areaHeight) + 1))
      .attr("text-anchor", "middle");
    svg.raise();
  }, [circle, dimensions]);

  useEffect(() => {
    if (!dimensions) return;
    if (!circle) return;

    const svg = select(svgRef.current);
    const xScale = scaleBand()
      .domain(horizontalSegmentAxis.map((d) => d) as Iterable<string>)
      .range([0, dimensions.width]);
    const yScale = scaleBand()
      .domain(verticalSegmentAxis.map((d) => d) as Iterable<string>)
      .range([0, dimensions.height]);
    const xScaleLinear = scaleLinear()
      .domain(extent(horizontalSegment))
      .range([0, dimensions.width]);
    const yScaleLinear = scaleLinear()
      .domain(extent(verticalSegment))
      .range([dimensions.height, 0]);
    const yScaleForIndexOnly = scaleBand()
      .domain(verticalSegmentAxis.map((d) => d) as Iterable<string>)
      .range([dimensions.height, 0]);

    // console.log(xScale((3 + 1) as any));
    // console.log(yScale((4 + 1) as any));

    const xAxis = axisBottom(xScale)
      .ticks(horizontalSegment.length)
      .tickFormat((domain) => `${horizontalSegmentMap[domain as any]}`)
      .tickSizeOuter(0)
      .tickSizeInner(0)
      .tickPadding(5);
    const yAxis = axisRight(yScaleForIndexOnly)
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

    const getViolationCoordinates = (
      collisionRecord: Record<number, number[]>,
      circles: CircleType[]
    ): { x: number; y: number }[] => {
      // Caution! This function assumes circle id === index in circles

      const violationCoordinates: { x: number; y: number }[] = [];
      Object.entries(collisionRecord).forEach(([key]) => {
        collisionRecord[key].forEach((value: number) => {
          const tempA = parseInt(key, 10) - 1;
          const avgX = (circles[tempA.toString()].x + circles[value - 1].x) / 2;
          const avgY = (circles[tempA.toString()].y + circles[value - 1].y) / 2;
          violationCoordinates.push({ x: avgX, y: avgY });
        });
      });
      console.log("violationCoordinates: ", violationCoordinates);

      return violationCoordinates;
    };

    const updateAreaViolation = (
      evaluatedAreas: Areas,
      violationCoordinates: { x: number; y: number }[]
    ) => {
      const tempAreas = evaluatedAreas;
      // console.log("violationCoordinates: ", violationCoordinates);
      console.log("tempAreas: ", tempAreas);
      violationCoordinates.forEach((c) => {
        // console.log(xScale(tempAreas[0].x as any) + xScale.bandwidth());
        // console.log(xScale((violationCoordinates[0].x + 1) as any));
        for (let i = 0; i < tempAreas.length; i += 1) {
          const areaX = xScale(tempAreas[i].x as any) + xScale.bandwidth();
          const areaY = yScale(tempAreas[i].y as any) + yScale.bandwidth();
          // const areaX = xScaleLinear(tempAreas[i].x);
          // const areaY = yScaleLinear(tempAreas[i].y);
          console.log("areaX: ", areaX);
          console.log("areaY: ", areaY);
          console.log("x,y", xScaleLinear(c.x + 1), yScaleLinear(c.y + 1));
          if (
            areaX >= xScaleLinear(c.x + 1) &&
            areaY >= yScaleLinear(c.y + 1)
          ) {
            // if (tempAreas[i].x >= c.x && tempAreas[i].x >= c.y) {
            tempAreas[i].violations += 1;
            i = tempAreas.length;
          }
        }
      });

      return tempAreas;
    };
    const colorScale = scaleSequential([0, 10], interpolateReds);

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
      .on("click", (_, { x, y }) => {
        console.log("area : ", x, y);
      })
      .attr("x", (d) => xScale(d.x as any))
      .attr("y", (d) => yScale(d.y as any))
      .lower()
      .attr("fill", (d) => colorScale(d.violations))
      .attr("stroke", "none")
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth());

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
  useInterval(async () => {
    const temp = await getPositions();
    setCircle(() => {
      isCollide(temp);
      return temp;
    });
  }, 2000);

  return (
    <>
      <div className="container mx-auto my-auto flex w-screen h-screen overflow-visible justify-center">
        <div
          // style={{ width: "1024px", height: "512px" }}
          className="overflow-visible h-10/12 w-11/12 p-12"
          ref={wrapperRef}
        >
          {/* <div className="h-screen w-screen" ref={wrapperRef}> */}
          <svg
            ref={svgRef}
            className="w-full h-full overflow-visible mx-auto my-auto"
          >
            <g className="tooltip" ref={tooltipRef} />
            <g className="tooltip-area" ref={areaTooltipRef} />
            {/* <g className="tooltip-collisions" ref={tooltipCollisionsRef} /> */}
            <clipPath ref={clipPathRef} id="clipPath" />
            <g className="vertical-grid" />
            <g className="horizontal-grid" />
            <g className="x-axis" />
            <g className="y-axis" />
          </svg>
        </div>
        <div>
          {focusedCircle ? (
            <div>
              <p>Number of collisions: {focusedCircle.collisions}</p>
              <p>Circleid: {focusedCircle.id}</p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default SvgAreaCircle;
