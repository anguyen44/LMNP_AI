import { ChatGroq } from '@langchain/groq';
import { Injectable } from '@nestjs/common';
import { BufferMemory } from 'langchain/memory';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { systemLmnpPrompt } from './temlates/systemLmnpPrompt';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { SimulateLmnpTool } from './tools/simulateLmnp';
import { ChatStoreMemory } from './memory/chat-store-memory';
import { chatStore } from './memory/inMemoryStore';

@Injectable()
export class AiService {
  private readonly model: ChatGroq;
  private executor: any;

  constructor() {
    this.model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY, // Default value.
      model: 'llama-3.3-70b-versatile',
      streaming: true,
    });

    this.setup(this.model);
  }

  async setup(model: ChatGroq) {
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', systemLmnpPrompt],
      ['placeholder', '{chat_history}'],
      ['human', '{input}'],
      ['placeholder', '{agent_scratchpad}'],
    ]);

    // const memory = new BufferMemory({
    //   returnMessages: true,
    //   memoryKey: 'chat_history', // 👈 phải match với prompt
    //   inputKey: 'input',
    //   outputKey: 'output',
    // });

    const tools = [new SimulateLmnpTool()];

    const agent = await createToolCallingAgent({
      llm: model,
      tools,
      prompt,
    });

    const memory = new ChatStoreMemory();

    this.executor = new AgentExecutor({
      agent,
      tools, // dùng lại biến tools
      memory,
      verbose: true,
    });
  }

  getModel() {
    return this.model;
  }

  getExecutor() {
    return this.executor;
  }
}
