import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
        SET_LOADING: (state, { payload }: PayloadAction<boolean>) => {
            state.loading = false;
        },
        SET_LOADED: (state) => {
            state.loading = true;
        },
    },
});

export const { SET_LOADED, SET_LOADING } = status.actions;

export default status.reducer;
