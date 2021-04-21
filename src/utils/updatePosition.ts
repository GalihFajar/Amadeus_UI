import axios from "axios";

const updatePosition = async () => {
  const url = "http://localhost:4000/graphql";
  const result = await axios({
    url,
    method: "post",
    data: {
      query: `
        query{
            receivers{
              rssis
              receiverUUID
            }
          }
          
        `,
    },
  });
  console.log("result: ", result.data.data);
};

export default updatePosition;
