// in-memory-chat.store.ts
import { Injectable } from '@nestjs/common';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

@Injectable()
export class InMemoryChatStore {
  private history: ChatMessage[] = []; // chỉ một user

  getHistory(): ChatMessage[] {
    return this.history;
  }

  addMessage(message: ChatMessage) {
    this.history.push(message);
  }

  clearHistory() {
    this.history = [];
  }
}

export const chatStore = new InMemoryChatStore();
