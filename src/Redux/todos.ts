import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ToDo } from "../types/AppTypes";
import { initialTodosState } from "../Util/InitialState";

const newToDo = {
  id: -1,
  name: "New to do...",
  complete: false,
};

export const plotSlice = createSlice({
  name: "todos",
  initialState: initialTodosState,
  reducers: {
    SET_TODOS: (_, { payload }: PayloadAction<ToDo[]>) => {
      return { todos: payload, showComplete: false };
    },
    ADD_TODO: ({ todos }) => {
      let newId = -1;
      todos.map(({ _id }) => {
        if (_id > newId) newId = _id + 1;
      });
      todos.unshift({ ...newToDo, _id: newId });
    },
    SET_COMPLETE: (
      { todos },
      { payload: { _id } }: PayloadAction<{ _id: number }>
    ) => {
      let todo = todos.find((t) => t._id === _id);
      if (todo) todo.complete = !todo.complete;
    },
    DELETE_TODO: ({ todos }, action: PayloadAction<ToDo>) => {
      todos.filter((t) => t._id === action.payload._id);
    },
    EDIT_TODO: (
      { todos },
      { payload: { _id, value } }: PayloadAction<{ _id: number; value: string }>
    ) => {
      let todo = todos.find((t) => t._id === _id);
      if (todo) todo.name = value;
    },
  },
});

export const { SET_TODOS, ADD_TODO, SET_COMPLETE, DELETE_TODO, EDIT_TODO } =
  plotSlice.actions;
export default plotSlice.reducer;
