import axios from "axios";
import * as secureStore from "expo-secure-store";
import { API_URI } from "./InitialState";

export const refreshAccessToken = async (): Promise<string> => {
  const REFRESH_TOKEN = await secureStore.getItemAsync("REFRESH_TOKEN");
  if (!REFRESH_TOKEN) throw new Error("No refresh token");

  let response = await axios.post(
    `${API_URI}/refresh`,
    {},
    {
      headers: {
        "x-refresh-token": REFRESH_TOKEN,
      },
    }
  );

  return response.data.ACCESS_TOKEN;
};
