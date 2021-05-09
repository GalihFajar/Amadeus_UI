import { CircleType } from "../constants/types";

/**
 * Mencatat lingkaran mana saja yang berpotongan dengan suatu lingkaran.
 * @param circles {CircleType[]} Array obyek lingkaran.
 * @returns Map.
 */
const recordCollision = (circles: CircleType[]) => {
  const collisionRecord: Record<number, number[]> = {};
  circles.forEach((circle) => {
    if (circle.collideWith.length > 0) {
      circle.collideWith.forEach((collideWithCircle) => {
        let isAlreadyRecorded: boolean = false;
        if (!collisionRecord[collideWithCircle]) {
          isAlreadyRecorded = false;
        } else {
          collisionRecord[collideWithCircle].forEach((c) => {
            if (c === circle.id) {
              isAlreadyRecorded = true;
            }
          });
        }
        if (!isAlreadyRecorded) {
          if (!collisionRecord[circle.id]) {
            collisionRecord[circle.id] = [];
          }
          collisionRecord[circle.id].push(collideWithCircle);
        }
      });
    }
  });
  return collisionRecord;
};

export default recordCollision;
