import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ShowState {
    name: string;
    owner: string | undefined;
    accessList: string[] | undefined;
}
const initialState: ShowState = {
    name: "No show selected",
    owner: undefined,
    accessList: undefined,
};

const showSlice = createSlice({
    name: "show",
    initialState,
    reducers: {
        SET_SHOW: (state, { payload }: PayloadAction<typeof initialState>) => {
            return (state = payload);
        },
    },
});

export const { SET_SHOW } = showSlice.actions;

export default showSlice.reducer;
