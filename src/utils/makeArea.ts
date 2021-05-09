import { Area, Areas } from "../constants/types";

/**
 * Membuat array objek yang berisi segmen area horizontal dan vertikal
 * @param horizontal {HorizontalType[]} Segmen area horizontal.
 * @param vertical {VerticalType[]} Segmen area vertikal.
 * @returns Array objek segmen area (horizontal dan vertikal)
 */
function makeAreaHelper<HorizontalType, VerticalType>(
  horizontal: HorizontalType[],
  vertical: VerticalType[]
) {
  let temp: Area<HorizontalType, VerticalType>[] = [];
  for (let i = 0; i < horizontal.length; i += 1) {
    for (let j = 0; j < vertical.length; j += 1) {
      temp = [...temp, { x: horizontal[i], y: vertical[j] }];
    }
  }
  return temp;
}
/**
 * Melakukan inisiasi area.
 * @param areas {Areas} Objek area.
 */
const initializeArea = (areas: Areas): void => {
  areas.forEach((area_) => {
    const area = area_;
    area.violations = 0;
  });
};

/**
 * Melakukan pembuatan area pengamatan.
 * @param horizontal {HorizontalType[]} Segmen area horizontal.
 * @param vertical {VerticalType[]} Segmen area vertikal.
 * @returns Areas.
 */
export default function makeArea<HorizontalType, VerticalType>(
  horizontal: HorizontalType[],
  vertical: VerticalType[]
): Areas {
  const areas = (makeAreaHelper(horizontal, vertical) as unknown) as Areas;
  initializeArea(areas);
  return areas;
}
