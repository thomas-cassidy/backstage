import { Plot } from "../Types/AppTypes";

export type AppRoutes = {
    Home: undefined,
    Cast: undefined,
    CastProfile: { id: string },
    CueSheets: undefined,
    NewCueSheet: undefined,
    PlotPage: { id: string },
    ToDos: undefined,
}