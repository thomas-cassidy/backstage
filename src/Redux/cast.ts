import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { Alert } from "react-native";
import { CastMember } from "../Types/AppTypes";
import { AXIOS_API } from "../Util/Axios";
import { initialCastState } from "../Util/InitialState";
import { RootState } from "./store";
import { ImagePickerAsset } from "expo-image-picker";
import FormData from "form-data";

interface ExpectedServerSuccess {
  status: "ok";
  cast: CastMember[];
}
interface ExpectedServerFailure {
  status: "error";
  error: string;
}

export const ADD_CASTMEMBER_ASYNC = createAsyncThunk<
  CastMember[],
  { castMember: CastMember; image?: ImagePickerAsset },
  { state: RootState }
>("cast/ADD_CASTMEMBER_ASYNC", async ({ castMember, image }, { getState }) => {
  try {
    const formData = new FormData();
    formData.append("action", "ADD");
    formData.append("data", JSON.stringify(castMember));
    if (image) {
      formData.append("image", {
        uri: image.uri,
        name: image.fileName,
        type: image.type,
      });
    }
    const response = await AXIOS_API.post<
      ExpectedServerSuccess | ExpectedServerFailure
    >(`/shows/${getState().show._id}/cast`, formData);
    if (response.data.status === "error") {
      console.log("cast add", response.data.error);
      throw new Error(response.data.error);
    }
    return response.data.cast;
  } catch (e) {
    console.log("error occurred when adding cast member");
    throw e;
  }
});

export const UPDATE_CASTMEMBER_ASYNC = createAsyncThunk<
  CastMember[],
  { castMember: CastMember; image?: ImagePickerAsset },
  { state: RootState }
>(
  "cast/UPDATE_CASTMEMBER_ASYNC",
  async ({ castMember, image }, { getState, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("action", "UPDATE");
      formData.append("data", JSON.stringify(castMember));
      if (image) {
        formData.append("image", {
          uri: image.uri,
          name: image.fileName,
          type: image.type,
        });
      }

      const response: AxiosResponse<
        any,
        ExpectedServerSuccess | ExpectedServerFailure
      > = await AXIOS_API.post(`/shows/${getState().show._id}/cast`, formData);

      console.log("cats update axios respose", response.status);
      if (response.data.status === "error") {
        console.log("cast update", response.data.error);
        throw new Error();
      } else {
        return response.data.cast;
      }
    } catch {
      console.log("error occurred in cast update");
      throw new Error("error occurred in cast update");
    }
  }
);
export const DELETE_CASTMEMBER_ASYNC = createAsyncThunk<
  CastMember[],
  { castMember: CastMember },
  { state: RootState }
>("cast/DELETE_CASTMEMBER_ASYNC", async ({ castMember }, { getState }) => {
  try {
    const formData = new FormData();
    formData.append("action", "DELETE");
    formData.append("data", JSON.stringify(castMember));

    const response: AxiosResponse<
      ExpectedServerSuccess | ExpectedServerFailure
    > = await AXIOS_API.post(`/shows/${getState().show._id}/cast`, formData);

    if (response.data.status === "error") {
      console.log("cast delete", response.data.error);
      throw new Error(response.data.error);
    } else {
      return response.data.cast;
    }
  } catch {
    console.log("error occurred in cast delete");
    throw new Error("error occurred in cast delete");
  }
});

export const castSlice = createSlice({
  name: "cast",
  initialState: initialCastState,
  reducers: {
    SET_CAST: ({ cast }, { payload }: PayloadAction<CastMember[]>) => {
      let allGroups: string[] = [];
      payload.map((c, i) => {
        if (c.category) {
          if (allGroups.indexOf(c.category) === -1) {
            allGroups.push(c.category);
          }
        }
      });

      return {
        cast: payload,
        groups: allGroups,
      };
    },
    ADD_GROUP: ({ groups }, { payload }: PayloadAction<string>) => {
      groups.unshift(payload);
    },
    DELETE_GROUP: ({ cast, groups }, { payload }: PayloadAction<string>) => {
      return { cast, groups: groups.filter((g) => g !== payload) };
    },
    UPDATE_GROUP: (
      { groups },
      { payload }: PayloadAction<{ index: number; text: string }>
    ) => {
      groups[payload.index] = payload.text;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(UPDATE_CASTMEMBER_ASYNC.fulfilled, (_, { payload }) => {
      if (!payload) return;
      return { cast: payload, groups: [] };
      // console.log(payload);
    });
    builder.addCase(UPDATE_CASTMEMBER_ASYNC.rejected, () => {
      Alert.alert("Network Error", "CastMember was not updated.");
    });
    builder.addCase(ADD_CASTMEMBER_ASYNC.fulfilled, ({ cast }, { payload }) => {
      if (!payload) return;
      return { cast: payload, groups: [] };
    });
    builder.addCase(
      DELETE_CASTMEMBER_ASYNC.fulfilled,
      ({ cast }, { payload }) => {
        if (!payload) return;
        return { cast: payload, groups: [] };
      }
    );
  },
});

export const { SET_CAST, ADD_GROUP, DELETE_GROUP, UPDATE_GROUP } =
  castSlice.actions;

export default castSlice.reducer;
