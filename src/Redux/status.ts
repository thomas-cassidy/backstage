import { createSlice } from "@reduxjs/toolkit";

export interface IStatusState {
    loading: boolean;
}

const initialState: IStatusState = {
    loading: false,
};

const status = createSlice({
    name: "status",
    initialState,

    reducers: {
        SET_LOADING: (state) => {
            return { loading: true };
        },
        SET_LOADED: (state) => {
            return { loading: false };
        },
    },
});

export const { SET_LOADED, SET_LOADING } = status.actions;

export default status.reducer;
