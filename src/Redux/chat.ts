import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../Types/AppTypes";
import { initialChatState } from "../Util/InitialState";
import * as Notifications from "expo-notifications";
import { Vibration } from "react-native";
import { RootState } from "./store";

export const SET_CHAT_ASYNC = createAsyncThunk<Message[], Message[], { state: RootState }>(
  "chat/SET_CHAT_ASYNC",
  async (newChat, { getState }) => {
    try {
      let currentChat = getState().chat.chat;
      let lastMessage = newChat[newChat.length - 1];

      if (
        lastMessage._id !== currentChat[currentChat.length - 1]._id &&
        lastMessage.user !== getState().user.user?.name
      ) {
        await Notifications.scheduleNotificationAsync({
          content: {
            vibrate: [1, 1, 1],
            title: lastMessage.user.toString(),
            body: lastMessage.message,
          },
          trigger: null,
        });

        Vibration.vibrate();
      }

      return newChat;
    } catch {
      console.log("error occurred in chat");
      throw new Error();
    }
  }
);

export const chatSlice = createSlice({
  name: "chat",
  initialState: initialChatState,
  reducers: {
    SET_CHAT: ({ chat }, { payload }: PayloadAction<Message[]>) => {
      return { chat: payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(SET_CHAT_ASYNC.fulfilled, ({ chat }, { payload }) => {
      return { chat: payload };
    });
  },
});

export const { SET_CHAT } = chatSlice.actions;
export default chatSlice.reducer;
