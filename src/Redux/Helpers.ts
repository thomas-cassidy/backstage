import { RootState } from "./store";

export const getStatus = (state: RootState) => state.status;
export const getCast = (state: RootState) => state.cast.cast;
export const getAuth = (state: RootState) => state.auth;
