import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User } from "../Types/AppTypes";

export interface IUserState {
    user: User | null;
}

const initialState: IUserState = {
    user: null,
};

const user = createSlice({
    name: "user",
    initialState,
    reducers: {
        SET_USER: (state, { payload }: PayloadAction<User>) => {
            return { ...state, user: payload };
        },
    },
    extraReducers: (builder) => {},
});

export const { SET_USER } = user.actions;

export default user.reducer;
