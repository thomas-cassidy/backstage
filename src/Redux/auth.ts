import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { API_URI } from "../Util/InitialState";
import * as secureStore from "expo-secure-store";
import { User } from "../Types/AppTypes";
import { fetchShowNames } from "../Util/FetchShowNames";
import { SET_USER } from "./user";
import { SET_LOADED, SET_LOADING } from "./status";
import { refreshAccessToken } from "../Util/RefreshAccessToken";

export interface IAuthState {
  status: "loading" | "idle";
  loggedIn: boolean;
  ACCESS_TOKEN: string;
  error: undefined | string;
}

const initialState: IAuthState = {
  status: "idle",
  loggedIn: false,
  ACCESS_TOKEN: "",
  error: undefined,
};

interface ExpectedServerData {
  status: "ok" | "error";
  ACCESS_TOKEN: string;
  REFRESH_TOKEN: string;
  user: User;
}

export const LOGIN_ASYNC = createAsyncThunk<
  ExpectedServerData,
  { email: string; password: string }
>("login", async ({ email, password }, { dispatch }) => {
  dispatch(SET_LOADING());

  const res: AxiosResponse<ExpectedServerData> = await axios.post(`${API_URI}/login`, {
    email,
    password,
  });

  console.log(res);

  await secureStore.setItemAsync("REFRESH_TOKEN", res.data.REFRESH_TOKEN);

  let userData: User = res.data.user as User;
  let shows = await fetchShowNames(userData, res.data.ACCESS_TOKEN);
  dispatch(SET_USER({ ...userData, shows }));
  dispatch(SET_LOADED());
  return res.data;
});

export const LOGOUT_ASYNC = createAsyncThunk("logout", async (state, { dispatch }) => {
  const REFRESH_TOKEN = await secureStore.getItemAsync("REFRESH_TOKEN");
  if (!REFRESH_TOKEN) return;
  const res = await axios.delete(`${API_URI}/logout`, {
    data: { token: REFRESH_TOKEN },
  });
  dispatch(SET_LOADED());
  return res.status;
});

export const REFRESH_ACCESS_TOKEN = createAsyncThunk(
  "REFRESH_ACCESS_TOKEN",
  async (state, { dispatch }) => {
    const ACCESS_TOKEN = await refreshAccessToken();
    dispatch(SET_ACCESS_TOKEN(ACCESS_TOKEN));
    return;
  }
);

const auth = createSlice({
  name: "auth",
  initialState,

  reducers: {
    SET_LOGGED_IN: (state, { payload }: PayloadAction<boolean>) => {
      state.loggedIn = payload;
    },
    CLEAR_ERROR: (state) => {
      state.error = undefined;
    },
    CLEAR_LOADING: (state) => {
      state.status = "idle";
    },
    SET_ACCESS_TOKEN: (state, { payload }: PayloadAction<string>) => {
      return { ...state, ACCESS_TOKEN: payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(LOGIN_ASYNC.pending, (state, action) => {
      console.log("login pending");
    });
    builder.addCase(LOGIN_ASYNC.fulfilled, (state, { payload }) => {
      // console.log("login success", payload);
      return {
        ...state,
        status: "idle",
        loggedIn: true,
        ACCESS_TOKEN: payload.ACCESS_TOKEN,
      };
    });
    builder.addCase(LOGIN_ASYNC.rejected, (state, { error }) => {
      console.log("LOGIN ASYNC ERROR", error.message);

      switch (error.message?.split(" ").pop()) {
        case "500":
          return { ...state, status: "idle", error: "Server Error" };
        default:
          return { ...state, status: "idle", error: error.message };
      }
    });

    builder.addCase(LOGOUT_ASYNC.fulfilled, (state) => {
      return { ...state, loggedIn: false, ACCESS_TOKEN: "" };
    });
    builder.addCase(LOGOUT_ASYNC.rejected, (state) => {
      return { ...state, loggedIn: false, ACCESS_TOKEN: "" };
    });
  },
});

export const { SET_LOGGED_IN, CLEAR_ERROR, CLEAR_LOADING, SET_ACCESS_TOKEN } = auth.actions;

export default auth.reducer;
