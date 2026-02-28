import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { Establishment } from 'src/establishments/entities/establishment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message, Establishment])],
  controllers: [ConversationsController],
  providers: [ConversationsService],
})
export class ConversationsModule {}
