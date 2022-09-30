import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { Alert } from "react-native";
import { CastMember } from "../Types/AppTypes";
import { AXIOS_API } from "../Util/Axios";
import { initialCastState } from "../Util/InitialState";
import { RootState } from "./store";

interface ExpectedServerSuccess {
  status: "ok";
  cast: CastMember[];
}
interface ExpectedServerFailure {
  status: "error";
  error: string;
}

// const getIndex = (cast: CastMember[], _id: string) => {
//   for (var x = 0; x < cast.length; x++) {
//     if (cast[x]._id === _id) {
//       return x;
//     }
//   }
//   return -1;
// };

export const UPDATE_CASTMEMBER_ASYNC = createAsyncThunk<
  CastMember[],
  CastMember,
  { state: RootState }
>("cast/UPDATE_CASTMEMBER_ASYNC", async (CastMember, { getState, dispatch }) => {
  try {
    const response: AxiosResponse<any, ExpectedServerSuccess | ExpectedServerFailure> =
      await AXIOS_API.post(`/shows/${getState().show._id}/cast`, {
        action: "UPDATE",
        data: JSON.stringify(CastMember),
      });
    if (response.data.status === "error") {
      console.log("cast update", response.data.error);
      throw new Error();
    } else {
      return response.data.cast;
    }
  } catch {
    console.log("error occurred in cast update");
    throw new Error();
  }
});

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
  },
  extraReducers: (builder) => {
    builder.addCase(UPDATE_CASTMEMBER_ASYNC.fulfilled, ({ cast }, { payload }) => {
      return { cast: payload, groups: [] };
      // console.log(payload);
    });
    builder.addCase(UPDATE_CASTMEMBER_ASYNC.rejected, () => {
      Alert.alert("Network Error", "CastMember was not updated.");
    });
  },
});

export const { SET_CAST } = castSlice.actions;

export default castSlice.reducer;
