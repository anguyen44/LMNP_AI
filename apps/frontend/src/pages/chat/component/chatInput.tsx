import { useState } from "react";
import axios from "axios";
import { useAppDispatch } from "../../../config/store/store";
import {
  addMessage,
  updateLastAiMessage,
  type Message,
} from "../../../config/store/slices/chatSlices";

type AIResponse = { response: string };

export const ChatInput = () => {
  const dispatch = useAppDispatch();
  const [pendingMessage, setPendingMessage] = useState("");

  const handleChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPendingMessage(e.target.value);
  };

  const handleSendMes = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const content = formData.get("chat") as string;
    if (content) {
      const userMessage: Message = { role: "user", content };
      dispatch(addMessage(userMessage));
      setPendingMessage("");
      const res = await getAiResponse({ input: content });
      const aiMessage: Message = {
        role: "assistant",
        content: res.data.response,
      };
      dispatch(addMessage(aiMessage));
    }
  };

  const handleSendMesWithStream = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const content = formData.get("chat") as string;
    if (content) {
      const userMessage: Message = { role: "user", content };
      dispatch(addMessage(userMessage));
      setPendingMessage("");
      dispatch(addMessage({ role: "assistant", content: "" }));
      await callApiStrem(content, (chunkData: string) => {
        dispatch(updateLastAiMessage(chunkData));
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  const getAiResponse = async (body: { input: string }) => {
    return axios.post<AIResponse>("http://localhost:3000/chat", body);
  };

  const callApiStrem = async (
    input: string,
    onChunk: (data: string) => void
  ) => {
    const response = await fetch("http://localhost:3000/chat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    const reader: ReadableStreamDefaultReader<Uint8Array> | undefined =
      response.body?.getReader();

    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder("utf-8");
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      let chunk = decoder.decode(value, { stream: true });

      // 🔎 Tách theo từng event SSE
      chunk.split("\n\n").forEach((line) => {
        if (line.startsWith("data:")) {
          const data = line.replace("data:", "").trim();
          if (!data || data === "[DONE]") return;
          onChunk(data);

          // // Typing effect từng ký tự
          // let i = 0;
          // const interval = setInterval(() => {
          //   if (i < data.length) {
          //     onChunk(data[i]); // emit từng ký tự
          //     i++;
          //   } else {
          //     clearInterval(interval);
          //   }
          // }, 10);
        }
      });
    }
  };

  return (
    <form className="mx-30 mt-2" onSubmit={handleSendMesWithStream}>
      <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
        <textarea
          id="chat"
          name="chat"
          className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Your message..."
          value={pendingMessage}
          onChange={handleChangeMessage}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
        >
          <svg
            className="w-5 h-5 rotate-90 rtl:-rotate-90"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 20"
          >
            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
          </svg>
          <span className="sr-only">Send message</span>
        </button>
      </div>
    </form>
  );
};
