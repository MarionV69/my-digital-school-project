import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { Establishment } from '../establishments/entities/establishment.entity';
import { FilesModule } from '../files/files.module';
import { DocumentsModule } from 'src/documents/documents.module';

@Module({
  imports: [
    FilesModule,
    DocumentsModule,
    TypeOrmModule.forFeature([Conversation, Message, Establishment]),
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService],
})
export class ConversationsModule {}
