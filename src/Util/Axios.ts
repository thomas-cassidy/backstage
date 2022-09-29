import axios, { AxiosError } from "axios";
import { IAuthState, SET_ACCESS_TOKEN } from "../Redux/auth";
import { AppDispatch } from "../Redux/store";
import { API_URI } from "./InitialState";
import { refreshAccessToken } from "./RefreshAccessToken";

export const AXIOS_API = axios.create({
  baseURL: API_URI,
  timeout: 10000,
});

export const setUpInterceptors = (auth: IAuthState, dispatch: AppDispatch) => {
  AXIOS_API.interceptors.request.use(
    async (config) => {
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  AXIOS_API.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      console.log("intercepted res err", error.code);
      const originalRequest = error.config as typeof error.config & {
        _retry?: boolean;
      };

      if (!originalRequest._retry) {
        console.log("retry time");
        originalRequest._retry = true;
        const ACCESS_TOKEN = await refreshAccessToken();
        dispatch(SET_ACCESS_TOKEN(ACCESS_TOKEN));

        originalRequest.headers = {
          ...originalRequest.headers,
          "x-access-token": ACCESS_TOKEN,
        };
        return AXIOS_API(originalRequest);
      }
      return Promise.reject(error);
    }
  );
};
export const removeInterceptors = (auth: IAuthState, dispatch: AppDispatch) => {
  AXIOS_API.interceptors.request.eject(1);
  AXIOS_API.interceptors.response.eject(1);
};

export const fetchImage = async (IMAGE_ID: string) => {
  const response = await AXIOS_API(`/images/${IMAGE_ID}`);
  console.log("fetchImage", response);

  const base64 = Buffer.from(response.data, "binary").toString("base64");

  return base64;
};
