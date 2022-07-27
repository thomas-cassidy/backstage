import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Show } from "../Types/AppTypes";
import { fetchShowData } from "../Util/FetchShowData";
import { refreshAccessToken } from "../Util/RefreshAccessToken";
import { SET_ACCESS_TOKEN } from "./auth";
import { RootState } from "./store";

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

interface ExpectedServerSuccess {
    status: "ok";
    show: Show;
}
interface ExpectedServerFailure {
    status: "error";
    error: string;
}

export const GET_SHOW_ASYNC = createAsyncThunk<
    any,
    { showId: string },
    { state: RootState }
>("show/get_show", async ({ showId }, { dispatch, getState }) => {
    let data: ExpectedServerSuccess | ExpectedServerFailure =
        await fetchShowData(showId, getState().auth.ACCESS_TOKEN);

    if (data.status === "error") {
        let NEW_ACCESS_TOKEN = await refreshAccessToken();
        dispatch(SET_ACCESS_TOKEN(NEW_ACCESS_TOKEN));
        data = await fetchShowData(showId, NEW_ACCESS_TOKEN);
    }
    if (data.status === "ok") {
        console.log(data.show.name);
    }

    return;
});

const showSlice = createSlice({
    name: "show",
    initialState,
    reducers: {
        SET_SHOW: (state, { payload }: PayloadAction<typeof initialState>) => {
            return (state = payload);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(GET_SHOW_ASYNC.fulfilled, () => {
            return;
        });
    },
});

export const { SET_SHOW } = showSlice.actions;

export default showSlice.reducer;
