import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Show } from "../Types/AppTypes";
import { fetchShowData } from "../Util/FetchShowData";
import { SET_CAST } from "./cast";
import { SET_PLOTS } from "./plots";
import { ISearchResult, SET_LOADED, SET_LOADING, SET_SEARCH_RESULT } from "./status";
import { RootState } from "./store";
import { SET_TODOS } from "./todos";
import { Alert } from "react-native";
import { AXIOS_API } from "../Util/Axios";
import { ADD_SHOW_TO_USER, DELETE_SHOW_FROM_USER } from "./user";

export type ShowState = {
  _id: number | string;
  name: string;
  owner: string;
  accessList: string[] | undefined;
};
export const initialState: ShowState = {
  _id: -1,
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

export const ADD_SHOW = createAsyncThunk<
  ShowState,
  { name: string; password: string; confirmPassword: string }
>("show/ADD_SHOW", async ({ name, password, confirmPassword }, { dispatch, getState }) => {
  dispatch(SET_LOADING());

  try {
    let { data } = await AXIOS_API.post<ExpectedServerSuccess | ExpectedServerFailure>("/shows", {
      name,
      password,
      confirmPassword,
    });

    if (data.status === "error") throw data.error;

    dispatch(SET_CAST(data.show.cast));
    dispatch(SET_PLOTS(data.show.plots));
    dispatch(SET_TODOS(data.show.todos));
    dispatch(ADD_SHOW_TO_USER({ _id: data.show._id, name: data.show.name }));
    dispatch(SET_LOADED());

    return {
      _id: data.show._id,
      name: data.show.name,
      owner: data.show.owner,
      accessList: data.show.accessList,
    };
  } catch (e) {
    console.log("ADD SHOW error", e);
    dispatch(SET_LOADED());
    return Promise.reject(`Server rejected your request. ${e}`);
  }
});

export const GET_SHOW_ASYNC = createAsyncThunk<
  ShowState,
  { showId: number | string },
  { state: RootState }
>("show/GET_SHOW_ASYNC", async ({ showId }, { dispatch, getState }) => {
  dispatch(SET_LOADING());

  try {
    let data: ExpectedServerSuccess | ExpectedServerFailure = await fetchShowData(
      showId,
      getState().auth.ACCESS_TOKEN
    );

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

export const GET_SHOW_BACKGROUND = createAsyncThunk<
  ShowState,
  { showId: number | string },
  { state: RootState }
>("show/GET_SHOW_BACKGROUND", async ({ showId }, { dispatch, getState }) => {
  try {
    let data: ExpectedServerSuccess | ExpectedServerFailure = await fetchShowData(
      showId,
      getState().auth.ACCESS_TOKEN
    );

    if (data.status === "ok") {
      data.show.isOwner = data.show.owner === getState().user.user?._id;
      dispatch(SET_CAST(data.show.cast));
      dispatch(SET_PLOTS(data.show.plots));
      dispatch(SET_TODOS(data.show.todos));

      return {
        _id: data.show._id,
        name: data.show.name,
        owner: data.show.owner,
        accessList: data.show.accessList,
      };
    } else throw Error("Unknown error");
  } catch {
    return Promise.reject("Server rejected your request.");
  }
});

interface ExpectedSearchResponse {
  status: "ok";
  show: {
    _id: number | string;
    name: string;
    owner: string | "Unknown. Contact Admin";
  };
}

export const SEARCH = createAsyncThunk<ISearchResult, { search: string }, { state: RootState }>(
  "show/SEARCH",
  async ({ search }, { dispatch }) => {
    try {
      dispatch(SET_LOADING());
      const response = await AXIOS_API.post<ExpectedSearchResponse | ExpectedServerFailure>(
        "/search",
        {
          search,
        }
      );

      dispatch(SET_LOADED());
      if (response.data.status === "error") {
        if (response.data.error === "Show not found") {
          dispatch(SET_SEARCH_RESULT("Show not found"));

          return null;
        } else {
          console.log("error in search", response.data.error);
          throw new Error(response.data.error);
        }
      } else {
        dispatch(SET_SEARCH_RESULT(response.data.show));
        return response.data.show;
      }
    } catch (e) {
      dispatch(SET_LOADED());
      console.log("error in search", e);
      return Promise.reject("Server rejected your request.");
    }
  }
);

export const DELETE_SHOW = createAsyncThunk<any, undefined, { state: RootState }>(
  "shows/DELETE_SHOW",
  async (_, { getState, dispatch }) => {
    try {
      const response = await AXIOS_API.delete<ExpectedServerSuccess | ExpectedServerFailure>(
        `/shows/${getState().show._id}`
      );
      if (response.data.status === "error") throw response.data.error;
      dispatch(DELETE_SHOW_FROM_USER({ _id: getState().show._id }));
      return;
    } catch (e) {
      console.log("Delete show error", e);
      return Promise.reject(e);
    }
  }
);

const showSlice = createSlice({
  name: "show",
  initialState,
  reducers: {
    SET_SHOW: (state, { payload }: PayloadAction<typeof initialState>) => {
      return (state = payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(GET_SHOW_ASYNC.fulfilled, (_, { payload }) => {
      return payload;
    });
    builder.addCase(GET_SHOW_ASYNC.rejected, () => {
      return Alert.alert("Could not get new data");
    });
    builder.addCase(GET_SHOW_BACKGROUND.fulfilled, (_, { payload }) => {
      return payload;
    });
    builder.addCase(SEARCH.fulfilled, () => {});
    builder.addCase(SEARCH.rejected, () => {
      return Alert.alert("Search has failed for some reason or other");
    });
    builder.addCase(ADD_SHOW.fulfilled, (_, { payload }) => {
      return payload;
    });
    builder.addCase(ADD_SHOW.rejected, (_, { error }) => {
      if (error.message) return Alert.alert(error.message);
    });
    builder.addCase(DELETE_SHOW.fulfilled, () => {
      return initialState;
    });
    builder.addCase(DELETE_SHOW.rejected, (_, { error }) => {
      return Alert.alert("Failed to delete show", error.message);
    });
  },
});

export const { SET_SHOW } = showSlice.actions;

export default showSlice.reducer;
