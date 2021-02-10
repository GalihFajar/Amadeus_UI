import { area, areas } from "../constants/types";

function makeAreaHelper<horizontalType, verticalType>(
  horizontal: horizontalType[],
  vertical: verticalType[]
) {
  let temp: area<horizontalType, verticalType>[] = [];
  for (let i = 0; i < horizontal.length; i++) {
    for (let j = 0; j < vertical.length; j++) {
      temp = [...temp, { x: horizontal[i], y: vertical[j] }];
    }
  }
  return temp;
}
const initializeArea = (areas: areas): void => {
  areas.forEach((area) => (area.violations = 0));
};

export default function makeArea<horizontalType, verticalType>(
  horizontal: horizontalType[],
  vertical: verticalType[]
): areas {
  const areas = (makeAreaHelper(horizontal, vertical) as unknown) as areas;
  initializeArea(areas);
  return areas;
}
