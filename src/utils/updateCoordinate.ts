import { CircleType, Size } from "../constants/types";

const updateCoordinate = (
  existingCircle: CircleType,
  { height, width }: Size
): CircleType => {
  const randX = Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1);
  const randY = Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1);

  let newX = existingCircle.x + randX;
  let newY = existingCircle.y + randY;

  if (newX > width) {
    newX -= 2 * randX;
  } else if (newX < 0) {
    newX += 2 * randX;
  }
  if (newY > height) {
    newY -= 2 * randY;
  } else if (newY < 0) {
    newY += 2 * randY;
  }
  return {
    ...existingCircle,
    x: newX,
    y: newY,
  };
};

export default updateCoordinate;
