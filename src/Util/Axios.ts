import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { SET_ACCESS_TOKEN } from "../Redux/auth";
import { useAppDispatch, useAppSelector } from "../Redux/hooks";
import { API_URI } from "./InitialState";
import { refreshAccessToken } from "./RefreshAccessToken";

export const AXIOS_API = axios.create({
    baseURL: API_URI,
    timeout: 10000,
});

export const useInterceptors = (): number[] => {
    const state = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const [reqInterceptor, setReqInterceptor] = useState<number>(0);
    const [resInterceptor, setResInterceptor] = useState<number>(0);

    useEffect(() => {
        AXIOS_API.interceptors.request.eject(reqInterceptor);
        AXIOS_API.interceptors.response.eject(resInterceptor);

        setReqInterceptor(() =>
            AXIOS_API.interceptors.request.use(
                async (config) => {
                    console.log("request interceptor");
                    if (!config.headers || !config.headers["x-access-token"]) {
                        config.headers = {
                            "x-access-token": state.auth.ACCESS_TOKEN,
                        };
                    }
                    return config;
                },
                (error) => {
                    Promise.reject(error);
                }
            )
        );

        setResInterceptor(() =>
            AXIOS_API.interceptors.response.use(
                (response) => {
                    return response;
                },
                async (error: AxiosError) => {
                    console.log("response interceptor err", error.message);

                    const originalRequest =
                        error.config as typeof error.config & {
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
                    return error.response;
                }
            )
        );
    }, [state.auth.ACCESS_TOKEN]);

    return [reqInterceptor, resInterceptor];
};

// export const fetchImage = async (IMAGE_ID: string) => {
//   const response = await AXIOS_API(`/images/${IMAGE_ID}`);
//   console.log("fetchImage", response);

//   const base64 = await Buffer.from(response.data, "binary").toString("base64");

//   return base64;
// };
