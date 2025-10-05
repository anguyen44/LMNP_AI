import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatState = {
  messages: Array<Message>;
};

const initialState: ChatState = {
  messages: [],
};

const ChatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateLastAiMessage: (state, action: PayloadAction<string>) => {
      const lastMessage = state.messages[state.messages.length - 1];
      if (lastMessage.role === "assistant") {
        lastMessage.content += action.payload;
      }
    },
  },
});

export const selectMessages = (state: RootState) => state.chat.messages;

export const { addMessage, updateLastAiMessage } = ChatSlice.actions;

export default ChatSlice.reducer;
