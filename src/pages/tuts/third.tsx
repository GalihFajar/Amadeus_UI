import { Box, Button, Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import BarChart from "../../components/BarChart";

const Third = ({}) => {
  const [data, setData] = useState([25, 30, 45, 50, 20, 75, 60, 60]);

  return (
    <Flex justify="center" alignItems="center">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxSize="xl"
      >
        <Box>
          <BarChart data={data} />
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
            <Button
              onClick={() => {
                setData([...data, Math.floor(Math.random() * 150)]);
              }}
            >
              Add Data
            </Button>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default Third;
