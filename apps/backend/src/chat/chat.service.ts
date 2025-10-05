import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { BufferMemory } from 'langchain/memory';
import { AgentExecutor } from 'langchain/agents';
import type { Response } from 'express';
import {
  SystemMessage,
  HumanMessage,
  AIMessage,
} from '@langchain/core/messages';
import { chatStore } from '../ai/memory/inMemoryStore';
import { systemLmnpPrompt } from '../ai/temlates/systemLmnpPrompt';

@Injectable()
export class ChatService {
  constructor(private readonly aiService: AiService) {}

  async getChatHistory() {
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
      // ✅ Lấy lịch sử hội thoại trong memory
      const { chat_history } = await memory.loadMemoryVariables({});
      // 👇 inject lại vào input cho agent
      const context = {
        chat_history,
        input,
      };

      // ✅ Bắt đầu stream
      const stream = await executor.stream(context);

      let fullOutput = '';

      for await (const chunk of stream) {
        let data: string | undefined;

        // LangChain chunk có thể chứa output ở nhiều dạng
        if (typeof chunk === 'string') {
          data = chunk;
        } else if (chunk?.output) {
          data = chunk.output;
        }

        if (data) {
          fullOutput += data;
          res.write(`${data}\n\n`);
          if ((res as any).flush) {
            (res as any).flush();
          }
        }
      }

      // ✅ Sau khi stream xong, cập nhật memory
      // await memory.saveContext({ input }, { output: fullOutput });

      // res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (err: any) {
      console.error('❌ STREAM ERROR:', err);
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
