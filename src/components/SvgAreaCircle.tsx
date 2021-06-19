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
import Cookie from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import generateHorizontalSegmentMap from "../constants/constants";
import { CircleType, Areas, Area } from "../constants/types";
import { isCollide } from "../utils/isCollide";
import makeArea from "../utils/makeArea";
import recordCollision from "../utils/recordCollision";
import useResizeObserver from "../utils/useResizeObserver";
import useInterval from "../utils/useInterval";
import Modals from "./Modals";
import useStore from "../utils/useStore";
// import getPositions from "../utils/getPositions";
import getPositionsDummy from "../utils/getPositionsDummy";
// import RenderTest from "../utils/renderTest";

interface SvgAreaCircleProps {
  circle: CircleType[];
}

const SvgAreaCircle: React.FC<SvgAreaCircleProps> = ({
  circle: initialCircle,
}: SvgAreaCircleProps) => {
  const areaHeight = 5;
  const areaWidth = 9;
  const wrapperRef = useRef();
  const clipPathRef = useRef();
  const svgRef = useRef();
  const tooltipRef = useRef();
  const areaTooltipRef = useRef();

  const dimensions: DOMRectReadOnly = useResizeObserver(wrapperRef);

  const [index, setIndex] = useState(0);

  const [circle, setCircle] = useState(initialCircle);
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
  const [focusedCircle, setFocusedCircle] = useState<CircleType>(null);
  const [focusedArea, setFocusedArea] = useState<Area<number, number>>(null);
  const [focusedAreaCoordinate, setFocusedAreaCoordinate] = useState(null);
  const { showModal } = useStore();
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
    const clipPath = select(clipPathRef.current);
    clipPath
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", dimensions.height)
      .attr("width", dimensions.width)

      .attr("stroke", "black")
      .style("fill", "none")
      .style("stroke-width", 0.3);
  }, [dimensions]);

  /**
   * CIRCLE HOOK
   * Hook untuk menggambar serta memperbarui lingkaran.
   */
  useEffect(() => {
    if (!dimensions) return;
    const svg = select(svgRef.current);
    const tooltip = select(tooltipRef.current);
    const colorScale = scaleSequential([0, 20].reverse(), interpolateRdYlGn);

    const xScaleLinear = scaleLinear()
      .domain(extent(horizontalSegment))
      .range([dimensions.width, 0]);
    const yScaleLinear = scaleLinear()
      .domain(extent(verticalSegment))
      .range([dimensions.height, 0]);
    svg
      .selectAll(".ellipse")
      .data(circle)
      .join("ellipse")
      .attr("class", "ellipse")
      .style("clip-path", "url(#clipPath)")
      .on("mouseenter", (_, d) => {
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
        setFocusedArea(null);
        setFocusedCircle(c);
        showModal();
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
      .attr("cx", (d) => xScaleLinear(d.x + 1))
      .attr("cy", (d) => yScaleLinear(d.y + 1))
      .attr("rx", (d) => {
        const radiusX = -xScaleLinear(d.x + 1) + xScaleLinear(d.x);
        return radiusX * d.radius;
      })
      .attr("ry", (d) => {
        const radiusY = yScaleLinear(d.y) - yScaleLinear(d.y + 1);
        return radiusY * d.radius;
      })
      .attr("stroke", "transparent")
      .transition()
      .attr("fill", (d) => (d.isCollide ? "red" : colorScale(d.collisions)))
      .attr("opacity", 0.5);
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

  /**
   * AREA HOOK
   * Hook untuk menggambar area.
   */
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
      .range([dimensions.width, 0]);
    const yScaleLinear = scaleLinear()
      .domain(extent(verticalSegment))
      .range([dimensions.height, 0]);
    const yScaleForIndexOnly = scaleBand()
      .domain(verticalSegmentAxis.map((d) => d) as Iterable<string>)
      .range([dimensions.height, 0]);

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

    /**
     * Menentukan koordinat tempat terjadinya pelanggaran.
     * @param collisionRecord {Record<number,number[]>} Map collision antar Circle.
     * @param circles {CircleType[]} Array berisi obyek Circle.
     * @returns {Object[]} Objek berupa koordinat area.
     */
    const getViolationCoordinates = (
      collisionRecord: Record<number, number[]>,
      circles: CircleType[]
    ): { x: number; y: number }[] => {
      const violationCoordinates: { x: number; y: number }[] = [];
      Object.entries(collisionRecord).forEach(([key]) => {
        collisionRecord[key].forEach((value: number) => {
          const tempA = parseInt(key, 10) - 1;
          const avgX = (circles[tempA.toString()].x + circles[value - 1].x) / 2;
          const avgY = (circles[tempA.toString()].y + circles[value - 1].y) / 2;
          violationCoordinates.push({ x: avgX, y: avgY });
        });
      });

      return violationCoordinates;
    };

    /**
     * Melakukan pembaruan terhadap jumlah pelanggaran pada suatu area.
     * @param evaluatedAreas {Areas} Area yang dievaluasi.
     * @param violationCoordinates {Object[]} Koordinat terjadinya pelanggaran.
     * @returns Area yang telah diperbarui jumlah pelanggarannya.
     */
    const updateAreaViolation = (
      evaluatedAreas: Areas,
      violationCoordinates: { x: number; y: number }[]
    ) => {
      const tempAreas = evaluatedAreas;
      violationCoordinates.forEach((c) => {
        for (let i = 0; i < tempAreas.length; i += 1) {
          const areaX = xScale(tempAreas[i].x as any) + xScale.bandwidth();
          const areaY = yScale(tempAreas[i].y as any) + yScale.bandwidth();
          if (
            areaX >= xScaleLinear(c.x + 1) &&
            areaY >= yScaleLinear(c.y + 1)
          ) {
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
    Cookie.set("areas", areas);

    svg
      .selectAll(".area")
      .data(areas)
      .join("rect")
      .attr("class", "area")
      .attr("x", (d) => xScale(d.x as any))
      .attr("y", (d) => yScale(d.y as any))
      .on("click", (_, a) => {
        setFocusedCircle(null);
        setFocusedArea(a);
        setFocusedAreaCoordinate(
          `${horizontalSegmentMap[a.x]}${Math.abs(areaHeight + 1 - a.y)}`
        );
        showModal();
      })
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

  /**
   * UPDATE HOOK
   * Hook untuk melakukan update estimasi posisi terakhir yang diterima dari backend.
   */
  useInterval(async () => {
    let temp: CircleType[];
    if (circle.length <= 0) {
      temp = await getPositionsDummy(undefined, index);
    } else {
      temp = await getPositionsDummy(circle, index);
    }
    // eslint-disable-next-line no-plusplus
    const last = index + 1;
    setIndex(last);

    // console.log("increment: ", increment);
    setCircle(() => {
      isCollide(temp);
      return temp;
    });
    // RenderTest.test(circle);
  }, 1000);

  return (
    <>
      <div className="container mx-auto my-auto flex w-screen h-screen overflow-visible justify-center">
        <Modals
          title={
            focusedCircle === null ? "Area Violations" : "Subject Violations"
          }
          focusedCircle={
            focusedCircle !== null
              ? {
                  violations: focusedCircle?.collisions,
                  id: focusedCircle?.id,
                }
              : null
          }
          focusedArea={
            focusedArea !== null
              ? { violations: focusedArea?.violations }
              : null
          }
          focusedAreaCoordinate={
            focusedAreaCoordinate === null ? null : focusedAreaCoordinate
          }
        />
        <div
          className="overflow-visible h-10/12 w-11/12 p-10 pt-3 mb-5 z-0 relative"
          ref={wrapperRef}
        >
          <svg
            ref={svgRef}
            className="w-full h-full overflow-visible mx-auto my-auto"
          >
            <g className="tooltip" ref={tooltipRef} />
            <g className="tooltip-area" ref={areaTooltipRef} />
            <clipPath ref={clipPathRef} id="clipPath" />
            <g className="vertical-grid" />
            <g className="horizontal-grid" />
            <g className="x-axis" />
            <g className="y-axis" />
          </svg>
        </div>
      </div>
    </>
  );
};

export default SvgAreaCircle;
