import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface IStatusState {
  loading: "no data" | "loading" | "loaded";
  searchResult: ISearchResult;
  hasSeenCastHint: boolean
}

export type ISearchResult =
  | "Show not found"
  | null
  | { _id: number | string; name: string; owner: string };

const initialState: IStatusState = {
  loading: "no data",
  searchResult: null,
  hasSeenCastHint: false
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
    SET_HAS_SEEN_HINT: (state) => {
      return {...state, hasSeenCastHint: true}
    },
    SET_HAS_NOT_SEEN_HINT: (state) => {
      return {...state, hasSeenCastHint: false}
    }
  },
});

export const { SET_LOADED, SET_LOADING, SET_SEARCH_RESULT, SET_HAS_SEEN_HINT, SET_HAS_NOT_SEEN_HINT } = status.actions;

export default status.reducer;
