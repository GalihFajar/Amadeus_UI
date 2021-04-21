import { CircleType } from "../constants/types";

const generateRandomCircle = (): CircleType => ({
  id: 0,
  x: Math.random() * (1023 / 2) + 1023 / 4,
  y: Math.random() * 256 + 256 / 2,
  radius: 20,
  isCollide: false,
  collideWith: [],
  collisions: 0,
});

export default generateRandomCircle;
