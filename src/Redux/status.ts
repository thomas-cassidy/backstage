import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface IStatusState {
  loading: "no data" | "loading" | "loaded";
  searchResult: ISearchResult;
}

export type ISearchResult =
  | "Show not found"
  | null
  | { _id: number | string; name: string; owner: string };

const initialState: IStatusState = {
  loading: "no data",
  searchResult: null,
};

const status = createSlice({
  name: "status",
  initialState,
  reducers: {
    SET_LOADING: (state) => {
      return { ...state, loading: "loading" };
    },
    SET_LOADED: (state) => {
      return { ...state, loading: "loaded" };
    },
    SET_SEARCH_RESULT: (state, { payload }: PayloadAction<ISearchResult>) => {
      return { ...state, searchResult: payload };
    },
  },
});

export const { SET_LOADED, SET_LOADING, SET_SEARCH_RESULT } = status.actions;

export default status.reducer;
