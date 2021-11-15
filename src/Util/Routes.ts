import { Plot } from "../Types/AppTypes";

export type AppRoutes = {
    Home: undefined,
    Cast: undefined,
    CastProfile: { id: number },
    CueSheets: undefined,
    NewCueSheet: undefined,
    PlotPage: { id: number },
    ToDos: undefined,
}