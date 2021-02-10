import React from "react";
import { rectType } from "../constants/types";

type DummySvgAreaBarProps = {
  size: {
    height: number;
    width: number;
  };
  rectProps: rectType[];
};

export const DummySvgAreaBar: React.FC<DummySvgAreaBarProps> = ({
  size,
  rectProps,
}) => {
  return (
    <>
      <svg width={size.width} height={size.height}>
        {rectProps.map((d) => {
          return (
            <rect
              x={d.x}
              y={d.y}
              width={2}
              height={d.height}
              fill={d.fill}
              key={d.x}
            />
          );
        })}
      </svg>
    </>
  );
};
