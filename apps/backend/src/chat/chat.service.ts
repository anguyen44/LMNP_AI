import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { BufferMemory } from 'langchain/memory';
import { AgentExecutor } from 'langchain/agents';
import type { Response } from 'express';
import {
  SystemMessage,
  HumanMessage,
  AIMessage,
  AIMessageChunk,
} from '@langchain/core/messages';
import { InMemoryChatStore } from '../ai/memory/inMemoryStore';
import { chatStore } from '../ai/memory/inMemoryStore';
import { systemLmnpPrompt } from '../ai/temlates/systemLmnpPrompt';

@Injectable()
export class ChatService {
  constructor(private readonly aiService: AiService) {}

  async getChatHistory() {
    // const executor = this.aiService.getExecutor();
    // const history = await this.getMemoryHistory(executor);
    // return history;
    return chatStore.getHistory();
  }

  async getAIResponse(input: string) {
    const executor = this.aiService.getExecutor();
    const res = await executor.invoke({ input });
    const history = await this.getMemoryHistory(executor);

    return {
      response: res.output,
      history,
    };
  }

  async streamAIReponse(input: string, res: Response) {
    const executor = this.aiService.getExecutor();
    const memory = executor.memory as BufferMemory;

    try {
      const stream = await executor.stream({ input });

      let fullOutput = '';

      for await (const chunk of stream) {
        let data: string | undefined;

        if (typeof chunk === 'string') {
          data = chunk;
        } else if (chunk?.output) {
          data = chunk.output;
        }

        if (data) {
          fullOutput += data;
          res.write(`data: ${data}\n\n`);
        }
      }

      // ✅ Save conversation context with correct keys
      // await memory.saveContext(
      //   { input: new HumanMessage(content) },
      //   { output: new AIMessage(fullOutput) },
      // );
      // chatStore.addMessage({ role: 'human', content: input });
      // chatStore.addMessage({ role: 'ai', content: fullOutput });

      // // ✅ Debug log ngay sau khi save
      // const hist = await memory.loadMemoryVariables({});
      // console.log(
      //   '>>> MEMORY DUMP',
      //   JSON.stringify(hist.chat_history, null, 2),
      // );

      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (err: any) {
      res.write(`data: [ERROR] ${err.message}\n\n`);
      res.end();
    }
  }

  async modelstreamAIReponse(input: string, res: Response) {
    const model = this.aiService.getModel();

    try {
      // Lấy history từ store và map về LangChain Messages
      const dbMessages = chatStore.getHistory();
      const messages = dbMessages.map((m) => {
        if (m.role === 'user') return new HumanMessage(m.content);
        if (m.role === 'assistant') return new AIMessage(m.content);
        if (m.role === 'system') return new SystemMessage(m.content);
        throw new Error(`Unknown role: ${m.role}`);
      });

      // Ghép prompt + history + input mới
      const stream = await model.stream([
        new SystemMessage(systemLmnpPrompt),
        ...messages,
        new HumanMessage(input),
      ]);

      let fullOutput = '';

      for await (const chunk of stream) {
        const aiChunk = chunk as AIMessageChunk;
        const token = aiChunk.content ?? '';
        if (token) {
          res.write(`data: ${token}\n\n`);
          fullOutput += token;
        }
        console.log('>>> CHUNK', JSON.stringify(chunk, null, 2));
      }

      // Lưu vào store
      chatStore.addMessage({ role: 'user', content: input });
      chatStore.addMessage({ role: 'assistant', content: fullOutput });

      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (err: any) {
      res.write(`data: [ERROR] ${err.message}\n\n`);
      res.end();
    }
  }

  private async getMemoryHistory(executor: AgentExecutor) {
    const memory = executor.memory as BufferMemory;
    const historyData = await memory.loadMemoryVariables({});
    const history = historyData.chat_history.map((h) => ({
      role: h.getType(),
      content: h.content,
    }));
    return history;
  }
}
