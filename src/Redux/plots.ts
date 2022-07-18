import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CueType, Plot } from "../Types/AppTypes";

export interface PlotState {
    plots: Plot[];
}

const initialState: PlotState = {
    plots: [],
};

export const plotSlice = createSlice({
    name: "plots",
    initialState: initialState,
    reducers: {
        ADD_PLOT: (
            { plots },
            { payload: { name } }: PayloadAction<{ name: string }>
        ) => {
            let newId;
            if (plots.length === 0) newId = "0";
            else newId = (parseInt(plots[plots.length - 1].id) + 1).toString();

            plots.push({
                name: name,
                cues: [
                    {
                        id: Math.random().toString(),
                        cuePoint: "New Cue",
                        location: "Location",
                        notes: "Press the Edit button to start adding Cues",
                        castMembers: [],
                    },
                ],
                id: newId,
            });
        },
        ADD_CUE: (
            { plots },
            { payload }: PayloadAction<{ id: string; index: number }>
        ) => {
            plots.map((p, i) => {
                if (p.id === payload.id)
                    p.cues.splice(payload.index + 1, 0, {
                        id: Math.random().toString(),
                        cuePoint: "New Cue " + payload.index,
                        location: "Location",
                        notes: "",
                        castMembers: [],
                    });
            });
        },
        DELETE_CUE: (
            { plots },
            { payload }: PayloadAction<{ id: string; index: number }>
        ) => {
            plots.map((p, i) => {
                if (p.id === payload.id) p.cues.splice(payload.index, 1);
            });
        },
        EDIT_CUE: (
            { plots },
            {
                payload: { id, index, field, value },
            }: PayloadAction<{
                id: string;
                index: number;
                field: keyof CueType;
                value: string;
            }>
        ) => {
            let p = plots.find((p) => p.id === id);
            if (p) {
                if (field === "castMembers") {
                    if (p.cues[index].castMembers.indexOf(value) != -1) {
                        p.cues[index].castMembers.splice(
                            p.cues[index].castMembers.indexOf(value),
                            1
                        );
                    } else p.cues[index].castMembers.push(value);
                } else p.cues[index][field] = value;
            }
        },
    },
});

export const { ADD_PLOT, ADD_CUE, DELETE_CUE, EDIT_CUE } = plotSlice.actions;

export default plotSlice.reducer;
