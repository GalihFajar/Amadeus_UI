import React, { useEffect, useState } from "react";
import SvgAreaCircle from "../../components/SvgAreaCircle";
import getPositions from "../../utils/getPositions";
import { isCollide } from "../../utils/isCollide";

const Visualization = () => {
  const [initialCircle, setInitialCircle] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      const circles = await getPositions();
      isCollide(circles);
      setInitialCircle(circles);
    };
    initialize();
  }, []);
  return (
    <>
      <div className="flex justify-center">
        <h1 className="text-xl">Social Distancing Violation</h1>
      </div>
      <SvgAreaCircle circle={initialCircle} />
    </>
  );
};

export default Visualization;