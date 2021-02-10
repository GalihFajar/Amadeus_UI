import { circleType } from "../constants/types";

const recordCollision = (circles: circleType[]) => {
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
          // collisionRecord[circle.id] = [
          //   ...collisionRecord[circle.id],
          //   collideWithCircle,
          // ];
        }
      });
    }
  });
  return collisionRecord;
};

export default recordCollision;
