import * as d3 from "d3";
import { data, rectType, size } from "../constants/types";

const barChart = (data: data, size: size) => {
  const [dateMin, dateMax] = d3.extent(data, (d) => d.date) as [Date, Date];
  const xScale = d3
    .scaleTime()
    .domain([dateMin, dateMax])
    .range([0, size.width]);
  //   console.log(typeof dateMin);

  const [min] = d3.extent(data, (d) => d.low);
  const [, max] = d3.extent(data, (d) => d.high);
  const yScale = d3.scaleLinear().domain([min, max]).range([size.height, 0]);

  const colorExtent = d3.extent(data, (d) => d.avg).reverse();
  const colorScale = d3.scaleSequential(colorExtent, d3.interpolateRdYlBu);

  let returnedData = [];
  for (let d of data) {
    returnedData.push({
      x: xScale(d.date),
      y: yScale(d.high),
      height: yScale(d.low) - yScale(d.high),
      fill: colorScale(d.avg),
    });
  }
  //   console.log(returnedData);
  return returnedData as rectType[];
};

export default barChart;
