import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExpectedServerFailure, ExpectedServerSuccess, ToDo } from "../Types/AppTypes";
import { initialTodosState } from "../Util/InitialState";
import { RootState } from "./store";
import { AxiosResponse } from "axios";
import { AXIOS_API } from "../Util/Axios";
import { Alert } from "react-native";

export const ADD_TODO = createAsyncThunk<ToDo[], string, { state: RootState }>(
  "todos/ADD_TODO",
  async (name, { getState, dispatch }) => {
    try {
      const response: AxiosResponse<any, ExpectedServerSuccess | ExpectedServerFailure> =
        await AXIOS_API.post(`/shows/${getState().show._id}/todos`, {
          action: "ADD",
          data: { name, completed: false },
        });
      if (response.data.status === "error") {
        console.log("todo add", response.data.error);
        throw new Error();
      } else {
        return response.data.todos;
      }
    } catch {
      console.log("error occurred in todo add");
      throw new Error();
    }
  }
);

export const UPDATE_TODO = createAsyncThunk<ToDo[], ToDo, { state: RootState }>(
  "todos/UPDATE_TODO",
  async (Todo, { getState, dispatch }) => {
    try {
      const response: AxiosResponse<any, ExpectedServerSuccess | ExpectedServerFailure> =
        await AXIOS_API.post(`/shows/${getState().show._id}/todos`, {
          action: "UPDATE",
          data: Todo,
        });
      if (response.data.status === "error") {
        console.log("todo update", response.data.error);
        throw new Error();
      } else {
        return response.data.todos;
      }
    } catch {
      console.log("error occurred in todo update");
      throw new Error();
    }
  }
);
export const DELETE_TODO = createAsyncThunk<ToDo[], ToDo, { state: RootState }>(
  "todos/DELETE_TODO",
  async (Todo, { getState, dispatch }) => {
    try {
      const response: AxiosResponse<any, ExpectedServerSuccess | ExpectedServerFailure> =
        await AXIOS_API.post(`/shows/${getState().show._id}/todos`, {
          action: "DELETE",
          data: Todo,
        });
      if (response.data.status === "error") {
        console.log("todo delete", response.data.error);
        throw new Error();
      } else {
        return response.data.todos;
      }
    } catch {
      console.log("error occurred in todo delete");
      throw new Error();
    }
  }
);

export const todosSlice = createSlice({
  name: "todos",
  initialState: initialTodosState,
  reducers: {
    SET_TODOS: (_, { payload }: PayloadAction<ToDo[]>) => {
      return { todos: payload, showComplete: false };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(ADD_TODO.fulfilled, (state, { payload }) => {
      return { ...state, todos: payload };
    });
    builder.addCase(ADD_TODO.rejected, () => {
      Alert.alert("Network Error", "Todo was not created.");
    });
    builder.addCase(UPDATE_TODO.fulfilled, (state, { payload }) => {
      return { ...state, todos: payload };
    });
    builder.addCase(UPDATE_TODO.rejected, () => {
      Alert.alert("Network Error", "Todo was not updated.");
    });
    builder.addCase(DELETE_TODO.fulfilled, (state, { payload }) => {
      return { ...state, todos: payload };
    });
    builder.addCase(DELETE_TODO.rejected, () => {
      Alert.alert("Network Error", "Todo was not deleted.");
    });
  },
});

export const { SET_TODOS } = todosSlice.actions;
export default todosSlice.reducer;
