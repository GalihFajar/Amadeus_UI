import * as d3 from "d3";
import { data, dataType, radialType, size } from "../constants/types";

const radialChart = (data: data, { width, height }: size) => {
  // ...

  const colorExtent = d3.extent(data, (d) => d.avg).reverse();
  const colorScale = d3.scaleSequential(colorExtent, d3.interpolateRdYlGn);
  const radiusScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.low), d3.max(data, (d) => d.high)])
    .range([0, width / 2]);
  const perDayAngle = (2 * Math.PI) / 365;
  let returnedData = [];
  for (let [i, d] of (data as Array<dataType>).entries()) {
    const pathGen = d3.arc();
    const path = pathGen({
      startAngle: i * perDayAngle,
      endAngle: (i + 1) * perDayAngle,
      innerRadius: radiusScale(d.low),
      outerRadius: radiusScale(d.high),
    });
    returnedData.push({
      path: path,
      fill: colorScale(d.avg),
    });
  }
  return returnedData as radialType[];
};

export default radialChart;
