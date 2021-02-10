import { Box, Button, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { select } from "d3";
import { VisualElementDragControls } from "framer-motion/types/gestures/drag/VisualElementDragControls";
import EventEmitter from "events";

interface FirstProps {}

const First: React.FC<FirstProps> = ({}) => {
  const svgRef = useRef();
  const [data, setData] = useState([25, 30, 45, 50, 60]);

  useEffect(() => {
    const svg = select(svgRef.current);
    svg
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("r", (value) => value)
      .attr("cx", (value) => value * 2)
      .attr("cy", (value) => value * 3)
      .attr("stroke", "red");
  }, [data]);

  return (
    <Box>
      <svg ref={svgRef}></svg>
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
  );
};

export default First;
