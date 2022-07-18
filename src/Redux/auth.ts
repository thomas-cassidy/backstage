import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { API_URI } from "../Util/InitialState";
import * as secureStore from "expo-secure-store";
import { User } from "../Types/AppTypes";

export interface IAuthState {
    loggedIn: boolean;
    ACCESS_TOKEN: string;
}

const initialState: IAuthState = {
    loggedIn: false,
    ACCESS_TOKEN: "",
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
>("login", async ({ email, password }) => {
    const res: AxiosResponse<ExpectedServerData> = await axios.post(
        `${API_URI}/login`,
        {
            email,
            password,
        }
    );

    await secureStore.setItemAsync("REFRESH_TOKEN", res.data.REFRESH_TOKEN);

    return res.data;
});

export const LOGOUT_ASYNC = createAsyncThunk("logout", async () => {
    const REFRESH_TOKEN = await secureStore.getItemAsync("REFRESH_TOKEN");
    if (!REFRESH_TOKEN) return;
    const res = await axios.delete(`${API_URI}/logout`, {
        data: { token: REFRESH_TOKEN },
    });
    return res.status;
});

const auth = createSlice({
    name: "auth",
    initialState,

    reducers: {
        SET_LOGGED_IN: (state, { payload }: PayloadAction<boolean>) => {
            state.loggedIn = payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(LOGIN_ASYNC.pending, (state, action) => {
            console.log("login pending");
        });
        builder.addCase(LOGIN_ASYNC.fulfilled, (state, { payload }) => {
            console.log("login success");
            return {
                ...state,
                loggedIn: true,
                ACCESS_TOKEN: payload.ACCESS_TOKEN,
            };
        });
        builder.addCase(LOGIN_ASYNC.rejected, (state, { error, payload }) => {
            console.log(error);
        });
        builder.addCase(LOGOUT_ASYNC.fulfilled, (state, { payload }) => {
            return { ...state, loggedIn: false, ACCESS_TOKEN: "" };
        });
        builder.addCase(LOGOUT_ASYNC.rejected, (state, { error, payload }) => {
            return { ...state, loggedIn: false, ACCESS_TOKEN: "" };
        });
    },
});

export const { SET_LOGGED_IN } = auth.actions;

export default auth.reducer;
