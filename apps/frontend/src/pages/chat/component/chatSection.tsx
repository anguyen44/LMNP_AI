import { useEffect, useRef } from 'react';
import {
  selectMessages,
  setMessages,
} from '../../../config/store/slices/chatSlices';
import { useAppDispatch, useAppSelector } from '../../../config/store/store';
import MessageBubble from './messageBubble';

const ChatSection = () => {
  const dispatch = useAppDispatch();
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const messages = useAppSelector(selectMessages);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // chỉ gọi nếu store hiện tại trống
        if (messages.length === 0) {
          const res = await fetch('http://localhost:3000/chat');
          if (!res.ok) throw new Error('Failed to fetch chat history');

          const history = await res.json();
          dispatch(setMessages(history));
        }
      } catch (err) {
        console.error('❌ Failed to load chat history:', err);
      }
    };

    fetchHistory();
  }, [dispatch, messages.length]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
