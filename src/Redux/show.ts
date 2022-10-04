import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Show } from "../Types/AppTypes";
import { fetchShowData } from "../Util/FetchShowData";
import { SET_CAST } from "./cast";
import { SET_PLOTS } from "./plots";
import { SET_LOADED, SET_LOADING } from "./status";
import { RootState } from "./store";
import { SET_TODOS } from "./todos";

interface ShowState {
    _id: string;
    name: string;
    owner: string;
    accessList: string[] | undefined;
}
const initialState: ShowState = {
    _id: "",
    name: "No show selected",
    owner: "",
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
    ShowState,
    { showId: string },
    { state: RootState }
>("show/get_show", async ({ showId }, { dispatch, getState }) => {
    dispatch(SET_LOADING());

    try {
        let data: ExpectedServerSuccess | ExpectedServerFailure =
            await fetchShowData(showId, getState().auth.ACCESS_TOKEN);

        if (data.status === "ok") {
            data.show.isOwner = data.show.owner === getState().user.user?._id;
            dispatch(SET_CAST(data.show.cast));
            dispatch(SET_PLOTS(data.show.plots));
            dispatch(SET_TODOS(data.show.todos));
            dispatch(SET_LOADED());
            console.log("redux/show/GET_SHOW_ASYNC", data.show._id);
            return {
                _id: data.show._id,
                name: data.show.name,
                owner: data.show.owner,
                accessList: data.show.accessList,
            };
        } else throw Error("Unknown error");
    } catch {
        dispatch(SET_LOADED());
        return Promise.reject("Server rejected your request.");
    }
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
        builder.addCase(
            GET_SHOW_ASYNC.fulfilled,
            ({ accessList, name, owner }, { payload }) => {
                return payload;
            }
        );
        builder.addCase(GET_SHOW_ASYNC.rejected, (x, y) => {
            return;
        });
    },
});

export const { SET_SHOW } = showSlice.actions;

export default showSlice.reducer;
