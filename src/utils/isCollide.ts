import { CircleType } from "../constants/types";

/**
 * Menentukan apakah lingkaran pertama berpotongan dengan lingkaran kedua.
 * @param circle1 {CircleType} Lingkaran pertama.
 * @param circle2 {CircleType} Lingkaran kedua.
 * @returns Boolean.
 */
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

/**
 * Memodifikasi properti isCollide, collideWith dan collisions pada obyek lingkaran berdasarkan apakah lingkaran berpotongan dengan lingkaran lain.
 * @param circlesInput {CircleType[]} Array berisi lingkaran-lingkaran yang menjadi subjek pengamatan.
 */
export const isCollide = (circlesInput: CircleType[]): void => {
  const circles = circlesInput;
  for (let i = 0; i < circles.length; i += 1) {
    circles[i].isCollide = false;
    circles[i].collideWith.length = 0;
  }
  for (let i = 0; i < circles.length; i += 1) {
    for (let j = 0; j < circles.length; j += 1) {
      if (isCollideHelper(circles[i], circles[j]) && i !== j) {
        console.log(circles[i]);
        circles[i].isCollide = true;
        circles[i].collideWith.push(circles[j].id);
        circles[i].collisions += 1;
      }
    }
  }
};
