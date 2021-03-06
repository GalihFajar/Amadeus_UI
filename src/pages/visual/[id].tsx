import { Box, Flex, Text } from "@chakra-ui/react";
// import router from "next/router";
import React, { useState } from "react";
import { SvgAreaCircle } from "../../components/SvgAreaCircle";
import { circleType } from "../../constants/types";
import { generateRandomCircle } from "../../utils/generateRandomCircle";
import { isCollide } from "../../utils/isCollide";

const Visualization = (): JSX.Element => {
  const [size, setSize] = useState({
    width: 650,
    height: 400,
  });
  const [initialCircle, _] = useState(() => {
    const numberOfCircles = 10;
    const temp: circleType[] = [];
    for (let i = 0; i < numberOfCircles; i++) {
      temp.push(generateRandomCircle());
      temp[i].id = i;
    }
    console.log("generated circles: ", temp);
    isCollide(temp);
    return temp;
  });
  // const temp = weatherData.map((d) => {
  //   return {
  //     ...d,
  //     date: Date.parse(d.date),
  //   };
  // });
  // const [bar] = useState(barChart(temp as data, size));

  // const bar = barChart(temp as data, size);
  // const [radial] = useState(radialChart(temp as data, size));
  // console.log(radial);
  // console.log("Hello");
  return (
    <>
      <Flex justify="center">
        <Box>
          <Text fontSize="6xl">Social Distancing Violation</Text>
        </Box>
      </Flex>
      <Flex justify="center">
        <SvgAreaCircle size={size} circle={initialCircle} />
      </Flex>
    </>
  );
};

export default Visualization;
