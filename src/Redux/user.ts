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
    ADD_SHOW_TO_USER: (
      state,
      { payload }: PayloadAction<{ _id: string | number; name: string }>
    ) => {
      state.user?.shows.push(payload);
    },
    DELETE_SHOW_FROM_USER: (state, { payload }: PayloadAction<{ _id: string | number }>) => {
      console.log("delet show from user", payload._id, state.user?.shows);
      if (state.user) {
        state.user.shows = state.user.shows.filter((s) => s._id != payload._id.toString());
      }
    },
  },
  extraReducers: (builder) => {},
});

export const { SET_USER, ADD_SHOW_TO_USER, DELETE_SHOW_FROM_USER } = user.actions;

export default user.reducer;
