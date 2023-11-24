import { RootState } from "./store";

export const getCast = (state: RootState) => state.cast.cast;
export const getAuth = (state: RootState) => state.auth;
