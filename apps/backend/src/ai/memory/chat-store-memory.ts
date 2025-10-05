// src/ai/memory/chat-store.memory.ts

import { BaseChatMemory } from 'langchain/memory';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { chatStore } from './inMemoryStore';

export class ChatStoreMemory extends BaseChatMemory {
  constructor() {
    super();
  }

  // 👇 Bắt buộc phải implement
  get memoryKeys(): string[] {
    return ['chat_history'];
  }

  async loadMemoryVariables(_values: any) {
    const messages = chatStore
      .getHistory()
      .map((m) =>
        m.role === 'user'
          ? new HumanMessage(m.content)
          : new AIMessage(m.content),
      );

    return {
      chat_history: messages,
    };
  }

  async saveContext(inputValues: any, outputValues: any) {
    if (inputValues?.input) {
      chatStore.addMessage({
        role: 'user',
        content: inputValues.input,
      });
    }
    if (outputValues?.output) {
      chatStore.addMessage({
        role: 'assistant',
        content: outputValues.output,
      });
    }
  }
}
