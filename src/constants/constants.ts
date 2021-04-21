const generateHorizontalSegmentMap = (
  numberOfSegments: number
): Record<number, string> => {
  const horizontalSegmentMap: Record<number, string> = {};
  for (let i = 0; i < numberOfSegments; i += 1) {
    horizontalSegmentMap[i + 1] = String.fromCharCode(65 + i);
  }
  return horizontalSegmentMap;
};

export default generateHorizontalSegmentMap;
