import React from "react";
import { radialType, size } from "../constants/types";

interface DummySvgAreaCircleProps {
  radialData: radialType[];
  size: size;
}

export const DummySvgAreaCircle: React.FC<DummySvgAreaCircleProps> = ({
  radialData,
  size,
}) => {
  return (
    <>
      <svg width={size.width} height={size.height}>
        <g transform={`translate(${size.width / 2}, ${size.height / 2})`}>
          {radialData.map((d, i) => (
            <path key={i} d={d.path} fill={d.fill} />
          ))}
        </g>
      </svg>
    </>
  );
};
