import { RootState } from "./store";

export const getStatus = (state: RootState) => state.status;
export const getCast = (state: RootState) => state.cast.cast;
export const getAuth = (state: RootState) => state.auth;
export const getShow = (state: RootState) => state.show;
export const getUser = (state: RootState) => state.user.user;
export const getChat = (state: RootState) => state.chat.chat;
export const getWs = (state: RootState) => state.websocket.ws;
