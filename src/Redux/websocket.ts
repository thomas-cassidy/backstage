import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { Alert } from "react-native";
import { SET_CHAT_ASYNC } from "./chat";
import { Message } from "../Types/AppTypes";
import { WS_URI } from "../Util/InitialState";

export interface IWSState {
  ws: WebSocket | null;
}

const initialState: IWSState = {
  ws: null,
};

export const CONNECT_WEBSOCKET = createAsyncThunk<WebSocket, undefined, { state: RootState }>(
  "ws/CONNECT_WEBSOCKET",
  async (_, { getState, dispatch }) => {
    try {
      dispatch(CLOSE_WS());
      let accessToken = getState().auth.ACCESS_TOKEN;
      let showId = getState().show._id;
      let url = `ws://${WS_URI}?x-access-token=${accessToken}&showId=${showId}`;

      let ws = new WebSocket(url);
      ws.onopen = () => {
        console.log("websocket connected");
      };

      ws.onerror = (e) => {
        console.log("websocket error", e);
      };

      ws.onmessage = async (e) => {
        console.log("websocket message");
        let data = JSON.parse(e.data);
        let newChat = data.chat as Message[];
        dispatch(
          SET_CHAT_ASYNC(
            newChat.map((m: Message) => {
              return {
                _id: m._id,
                message: m.message,
                dateCreated: new Date(m.dateCreated).toLocaleTimeString(),
                deleted: m.deleted,
                user: m.user,
              };
            })
          )
        );
      };

      ws.onclose = () => {
        console.log("websocket closed");
      };
      return ws;
    } catch (e) {
      console.log("error occurred connecting to websocket", e);
      Alert.alert("Network Error", "Could not connect to Chat.");
      throw new Error("Could not connect to websocket.");
    }
  }
);

const websocket = createSlice({
  name: "ws",
  initialState,
  reducers: {
    SET_WS: (state, { payload }: PayloadAction<WebSocket>) => {
      return { ...state, ws: payload };
    },
    CLOSE_WS: ({ ws }) => {
      if (ws) {
        ws.close();
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(CONNECT_WEBSOCKET.fulfilled, (state, { payload }) => {
      return { ...state, ws: payload };
    });
    builder.addCase(CONNECT_WEBSOCKET.rejected, (state, { error }) => {
      console.log(error);
      return;
    });
  },
});

export const { SET_WS, CLOSE_WS } = websocket.actions;

export default websocket.reducer;
