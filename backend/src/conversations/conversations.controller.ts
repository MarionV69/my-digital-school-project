import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { type AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { SendMessageDto } from './dto/send-message.dto';

@ApiTags('conversations')
@ApiBearerAuth()
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get('unread-count')
  getUnreadCount(@CurrentUser() user: AuthenticatedUser) {
    if (!user.establishmentId || !user.establishmentType) {
      throw new ForbiddenException(
        'You must create an establishment before checking unread messages',
      );
    }

    return this.conversationsService.getTotalUnreadCount(
      user.establishmentId,
      user.establishmentType,
    );
  }

  @Post()
  createConversation(
    @Body() createConversationDto: CreateConversationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!user.establishmentId || !user.establishmentType) {
      throw new ForbiddenException(
        'You must create an establishment before creating conversations',
      );
    }
    return this.conversationsService.createConversation(
      user.establishmentId,
      user.establishmentType,
      createConversationDto.supplierId,
    );
  }

  @Post(':id/messages')
  sendMessage(
    @Param('id', ParseIntPipe) conversationId: number,
    @Body() sendMessageDto: SendMessageDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!user.establishmentId || !user.establishmentType) {
      throw new ForbiddenException(
        'You must create an establishment before sending messages',
      );
    }

    return this.conversationsService.sendMessage(
      conversationId,
      user.establishmentId,
      user.establishmentType,
      sendMessageDto.content,
    );
  }

  @Get()
  getConversations(@CurrentUser() user: AuthenticatedUser) {
    if (!user.establishmentId || !user.establishmentType) {
      throw new ForbiddenException(
        'You must create an establishment before viewing conversations',
      );
    }
    return this.conversationsService.getConversations(
      user.establishmentId,
      user.establishmentType,
    );
  }

  @Get(':id/messages')
  getConversationMessages(
    @Param('id', ParseIntPipe) conversationId: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!user.establishmentId || !user.establishmentType) {
      throw new ForbiddenException(
        'You must create an establishment before viewing conversations',
      );
    }
    return this.conversationsService.getConversationMessages(
      conversationId,
      user.establishmentId,
      user.establishmentType,
    );
  }
}
