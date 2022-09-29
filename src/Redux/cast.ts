import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CastMember } from "../Types/AppTypes";
import { initialCastState } from "../Util/InitialState";

const getIndex = (cast: CastMember[], _id: string) => {
  for (var x = 0; x < cast.length; x++) {
    if (cast[x]._id === _id) {
      return x;
    }
  }
  return -1;
};

export const castSlice = createSlice({
  name: "cast",
  initialState: initialCastState,
  reducers: {
    SET_CAST: ({ cast }, { payload }: PayloadAction<CastMember[]>) => {
      return {
        cast: payload,
        groups: [],
      };
    },
    ADD_CASTMEMBER: ({ cast }, { payload }: PayloadAction<CastMember>) => {
      cast.push({ ...payload, _id: String(Math.random()).substring(2) });
    },
    REMOVE_CASTMEMBER: ({ cast }, { payload }: PayloadAction<CastMember>) => {
      cast.splice(getIndex(cast, payload._id), 1);
    },
    EDIT_CASTMEMBER: (
      state,
      {
        payload: { _id, field, value },
      }: PayloadAction<{ _id: string; field: keyof CastMember; value: string }>
    ) => {
      const castMember = state.cast.find((c) => c._id === _id);
      // if (castMember) {
      //   castMember[field] = value;
      // }
    },
  },
});

export const { SET_CAST, ADD_CASTMEMBER, EDIT_CASTMEMBER, REMOVE_CASTMEMBER } =
  castSlice.actions;

export default castSlice.reducer;
