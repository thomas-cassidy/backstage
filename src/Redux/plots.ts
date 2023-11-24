import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CueType, ExpectedServerFailure, Plot } from "../Types/AppTypes";
import { RootState } from "./store";
import { AxiosResponse } from "axios";
import { AXIOS_API } from "../Util/Axios";
import { Alert } from "react-native";

export interface PlotState {
  plots: Plot[];
}

const initialState: PlotState = {
  plots: [],
};

type ExpectedServerSuccess = {
  status: "ok";
  plots: Plot[];
};

export const ADD_PLOT_ASYNC = createAsyncThunk<Plot[], string, { state: RootState }>(
  "plots/ADD_PLOT_ASYNC",
  async (name, { getState, dispatch }) => {
    let plot: Plot = {
      _id: -1,
      cues: [],
      name: name,
    };
    try {
      const response: AxiosResponse<ExpectedServerSuccess | ExpectedServerFailure> =
        await AXIOS_API.post(`/shows/${getState().show._id}/plots`, {
          action: "ADD",
          data: plot,
        });
      if (response.data.status === "error") throw response.data.error;
      return response.data.plots;
    } catch (e) {
      console.log("error occurred in plot add");
      throw e;
    }
  }
);
export const UPDATE_CUE_ASYNC = createAsyncThunk<Plot[], number, { state: RootState }>(
  "plots/UPDATE_PLOT_ASYNC",
  async (_id, { getState, dispatch }) => {
    try {
      let plot = getState().plots.plots.find((p) => p._id === _id);
      if (!plot) throw new Error("Internal error. Plot not found.");
      const response: AxiosResponse<ExpectedServerSuccess | ExpectedServerFailure> =
        await AXIOS_API.post(`/shows/${getState().show._id}/plots`, {
          action: "UPDATE",
          data: plot,
        });

      if (response.data.status === "error") {
        console.log("cue update", response.data.error);
        throw new Error();
      } else {
        return response.data.plots;
      }
    } catch (e) {
      console.log("error occurred in cue update");
      throw e;
    }
  }
);

export const plotSlice = createSlice({
  name: "plots",
  initialState: initialState,
  reducers: {
    SET_PLOTS: ({ plots }, { payload }: PayloadAction<Plot[]>) => {
      return { plots: payload };
    },
    ADD_PLOT: ({ plots }, { payload: { name } }: PayloadAction<{ name: string }>) => {
      let newId;
      if (plots.length === 0) newId = 0;
      else newId = plots[plots.length - 1]._id + "1";

      plots.push({
        name: name,
        cues: [
          {
            _id: Math.random(),
            cuePoint: "New Cue",
            location: "Location",
            notes: "Press the Edit button to start adding Cues",
            castMembers: [],
          },
        ],
        _id: newId,
      });
    },
    ADD_CUE: ({ plots }, { payload }: PayloadAction<{ _id: number; index: number }>) => {
      plots.map((p, i) => {
        if (p._id === payload._id)
          p.cues.splice(payload.index + 1, 0, {
            _id: Math.random(),
            cuePoint: "",
            location: "",
            notes: "",
            castMembers: [],
          });
      });
    },
    DELETE_CUE: ({ plots }, { payload }: PayloadAction<{ _id: number; index: number }>) => {
      if (plots.length === 1) return;
      plots.map((p, i) => {
        if (p._id === payload._id) p.cues.splice(payload.index, 1);
      });
    },
    EDIT_CUE: (
      { plots },
      {
        payload: { _id, index, field, value },
      }: PayloadAction<{
        _id: number;
        index: number;
        field: keyof CueType;
        value: string | number;
      }>
    ) => {
      let p = plots.find((p) => p._id === _id);
      if (p) {
        if (field === "_id") return;
        if (typeof value === "string") {
          if (field !== "castMembers") p.cues[index][field] = value;
        }
        if (field === "castMembers") {
          console.log(value);
          if (p.cues[index].castMembers.indexOf(value) != -1) {
            p.cues[index].castMembers.splice(p.cues[index].castMembers.indexOf(value), 1);
          } else {
            p.cues[index].castMembers.push(value);
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(UPDATE_CUE_ASYNC.fulfilled, (e, { payload }) => {
      return { plots: payload };
    });
    builder.addCase(ADD_PLOT_ASYNC.fulfilled, (e, { payload }) => {
      return { plots: payload };
    });
    builder.addCase(ADD_PLOT_ASYNC.rejected, (e, { error }) => {
      return error.message ? Alert.alert(error.message) : Alert.alert("Something went wrong");
    });
  },
});

export const { SET_PLOTS, ADD_PLOT, ADD_CUE, DELETE_CUE, EDIT_CUE } = plotSlice.actions;

export default plotSlice.reducer;
