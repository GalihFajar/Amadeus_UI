import { circleType } from "../constants/types";

export const isCollideHelper = (
  circle1: circleType,
  circle2: circleType
): boolean => {
  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < circle1.radius + circle2.radius) {
    return true;
  } else {
    return false;
  }
};

export const isCollide = (circles: circleType[]): void => {
  for (let i = 0; i < circles.length; i++) {
    circles[i].isCollide = false;
    circles[i].collideWith.length = 0;
  }
  for (let i = 0; i < circles.length; i++) {
    for (let j = 0; j < circles.length; j++) {
      if (i === j) continue;
      else {
        if (isCollideHelper(circles[i], circles[j])) {
          circles[i].isCollide = true;
          circles[i].collideWith.push(circles[j].id);
          circles[i].collisions++;
        }
      }
    }
  }
};
