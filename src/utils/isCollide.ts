import { CircleType } from "../constants/types";

export const isCollideHelper = (
  circle1: CircleType,
  circle2: CircleType
): boolean => {
  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < circle1.radius + circle2.radius) {
    return true;
  }
  return false;
};

export const isCollide = (circlesInput: CircleType[]): void => {
  const circles = circlesInput;
  for (let i = 0; i < circles.length; i += 1) {
    circles[i].isCollide = false;
    circles[i].collideWith.length = 0;
  }
  for (let i = 0; i < circles.length; i += 1) {
    for (let j = 0; j < circles.length; j += 1) {
      if (isCollideHelper(circles[i], circles[j]) && i !== j) {
        circles[i].isCollide = true;
        circles[i].collideWith.push(circles[j].id);
        circles[i].collisions += 1;
      }
    }
  }
};
