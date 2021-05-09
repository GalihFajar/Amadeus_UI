import axios from "axios";
import { CircleType } from "../constants/types";

/**
 * Fungsi untuk melakukan fetch pada backend untuk menerima estimasi lokasi terakhir dari setiap lingkaran.
 * @returns {Promise} Estimasi lokasi terakhir setiap lingkaran.
 */
const getPositions = async (): Promise<CircleType[]> => {
  const result = await axios({
    url: "http://192.168.137.1:4000/graphql",
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
  positions.sort((a, b) => {
    if (a.receiverUUID < b.receiverUUID) return -1;
    if (a.receiverUUID > b.receiverUUID) return 1;
    return 0;
  });
  const returnedPositions: CircleType[] = positions.map((position) => {
    const p: CircleType = {
      id: parseInt(position.receiverUUID[1], 10),
      x: position.y,
      y: position.x,
      radius: 1.5,
      isCollide: false,
      collideWith: [],
      collisions: 0,
    };
    return p;
  });
  return returnedPositions;
};

export default getPositions;
