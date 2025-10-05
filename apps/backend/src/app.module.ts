import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai/ai.service';
import { AiModule } from './ai/ai.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [ConfigModule.forRoot(), AiModule, ChatModule],
  controllers: [AppController],
  providers: [AppService, AiService],
})
export class AppModule {}
