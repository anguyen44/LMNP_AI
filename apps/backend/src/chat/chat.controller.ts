import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
import type { Response } from 'express';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  public getChatHistory() {
    return this.chatService.getChatHistory();
  }

  @Post()
  public getAiResponse(@Body() body: { input: string }): Promise<any> {
    return this.chatService.getAIResponse(body.input);
  }

  @Post('stream')
  public streamAIReponse(
    @Body() body: { input: string },
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Transfer-Encoding', 'chunked');

    res.flushHeaders?.();

    return this.chatService.streamAIReponse(body.input, res);
  }
}
