import { useEffect, useRef } from "react";
import { selectMessages } from "../../../config/store/slices/chatSlices";
import { useAppSelector } from "../../../config/store/store";
import MessageBubble from "./messageBubble";

const ChatSection = () => {
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const messages = useAppSelector(selectMessages);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="mx-30 mt-15 h-120 overflow-y-auto flex flex-col gap-10 px-3 py-2 rounded-lg dark:bg-gray-800 dark:bg-gray-400">
      {messages.map((mes, index) => (
        <MessageBubble key={index} message={mes} />
      ))}
      <div ref={messageEndRef} />
    </div>
  );
};

export default ChatSection;
