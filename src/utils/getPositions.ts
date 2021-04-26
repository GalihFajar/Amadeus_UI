import axios from "axios";
import { CircleType } from "../constants/types";

const getPositions = async (): Promise<CircleType[]> => {
  const result = await axios({
    url: "http://localhost:4000/graphql",
    method: "post",
    data: {
      query: `
            query{
                positions{
                  x
                  y
                  receiverUUID
                }
              }
            `,
    },
  });
  const {
    positions,
  }: {
    positions: { x: number; y: number; receiverUUID: string }[];
  } = result.data.data;
  console.log("positions: ", positions);
  positions.sort((a, b) => {
    if (a.receiverUUID < b.receiverUUID) return -1;
    if (a.receiverUUID > b.receiverUUID) return 1;
    return 0;
  });
  const returnedPositions: CircleType[] = positions.map((position) => {
    const p: CircleType = {
      id: parseInt(position.receiverUUID[1], 10),
      x: position.x,
      y: position.y,
      radius: 1.35,
      isCollide: false,
      collideWith: [],
      collisions: 0,
    };
    return p;
  });
  console.log(returnedPositions);
  return returnedPositions;
};

export default getPositions;
