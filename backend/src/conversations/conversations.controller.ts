import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { type AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { SendMessageDto } from './dto/send-message.dto';
import { EstablishmentGuard } from 'src/common/guards/establishment.guard';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { ConversationResponseDto } from './dto/conversation-response.dto';
import { UnreadCountResponseDto } from './dto/unread-count-response.dto';

@ApiTags('conversations')
@ApiBearerAuth()
@UseGuards(EstablishmentGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a conversation with a supplier' })
  @ApiCreatedResponse({ type: Conversation })
  @ApiForbiddenResponse({
    description: 'Only restaurants can create conversations',
  })
  @ApiNotFoundResponse({ description: 'Supplier not found' })
  createConversation(
    @Body() createConversationDto: CreateConversationDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Conversation> {
    return this.conversationsService.createConversation(
      user.establishmentId!,
      user.establishmentType!,
      createConversationDto.supplierId,
    );
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Send a message in a conversation' })
  @ApiCreatedResponse({ type: Message })
  @ApiForbiddenResponse({
    description: 'Not a participant of this conversation',
  })
  @ApiNotFoundResponse({ description: 'Conversation not found' })
  sendMessage(
    @Param('id', ParseIntPipe) conversationId: number,
    @Body() sendMessageDto: SendMessageDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Message> {
    return this.conversationsService.sendMessage(
      conversationId,
      user.establishmentId!,
      user.establishmentType!,
      sendMessageDto.content,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all conversations' })
  @ApiOkResponse({ type: [ConversationResponseDto] })
  getConversations(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ConversationResponseDto[]> {
    return this.conversationsService.getConversations(
      user.establishmentId!,
      user.establishmentType!,
    );
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get total unread messages count' })
  @ApiOkResponse({ type: UnreadCountResponseDto })
  getUnreadCount(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UnreadCountResponseDto> {
    return this.conversationsService.getTotalUnreadCount(
      user.establishmentId!,
      user.establishmentType!,
    );
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get messages of a conversation' })
  @ApiOkResponse({ type: [Message] })
  @ApiForbiddenResponse({
    description: 'Not a participant of this conversation',
  })
  @ApiNotFoundResponse({ description: 'Conversation not found' })
  getConversationMessages(
    @Param('id', ParseIntPipe) conversationId: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Message[]> {
    return this.conversationsService.getConversationMessages(
      conversationId,
      user.establishmentId!,
      user.establishmentType!,
    );
  }
}
