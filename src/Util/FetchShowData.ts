// import axios from "axios";
import { AXIOS_API } from "./Axios";

export const fetchShowData = async (showId: number | string, ACCESS_TOKEN: string) => {
  console.log("fetchshowdata");

  let response = await AXIOS_API.get(`/shows/${showId}`, {
    headers: { "x-access-token": ACCESS_TOKEN },
  });

  return response.data;
};
