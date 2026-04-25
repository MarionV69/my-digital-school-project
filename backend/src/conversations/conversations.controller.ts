import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  ParseFilePipeBuilder,
  UploadedFile,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SendMessageDto } from './dto/send-message.dto';
import { EstablishmentGuard } from '../common/guards/establishment.guard';
import { Conversation } from './entities/conversation.entity';
import { ConversationResponseDto } from './dto/conversation-response.dto';
import { UnreadCountResponseDto } from './dto/unread-count-response.dto';
import { CurrentEstablishmentUser } from 'src/common/decorators/current-establishment-user.decorator';
import { type UserWithEstablishment } from 'src/common/types/user-with-establishment.type';
import { FileInterceptor } from '@nestjs/platform-express';
import { attachmentMulterOptions } from 'src/config/multer.config';
import { MessageAttachmentResponseDto } from './dto/message-attachments-response.dto';
import { MessageResponseDto } from './dto/message-response.dto';

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
    @CurrentEstablishmentUser() user: UserWithEstablishment,
  ): Promise<Conversation> {
    return this.conversationsService.createConversation(
      user.establishmentId,
      user.establishmentType,
      createConversationDto.supplierId,
    );
  }

  @Post(':id/messages/:messageId/attachments')
  @UseInterceptors(FileInterceptor('attachment', attachmentMulterOptions))
  @ApiOperation({ summary: 'Upload an attachment to a message' })
  @ApiCreatedResponse({ type: MessageAttachmentResponseDto })
  @ApiForbiddenResponse({
    description: 'Not a participant of this conversation',
  })
  @ApiNotFoundResponse({ description: 'Message not found' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        attachment: { type: 'string', format: 'binary' },
      },
    },
  })
  sendAttachment(
    @Param('id', ParseIntPipe) conversationId: number,
    @Param('messageId', ParseIntPipe) messageId: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 10 * 1024 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    attachment: Express.Multer.File,
    @CurrentEstablishmentUser() user: UserWithEstablishment,
  ): Promise<MessageAttachmentResponseDto> {
    return this.conversationsService.sendAttachment(
      conversationId,
      messageId,
      user.establishmentId,
      user.establishmentType,
      attachment,
    );
  }

  @Post(':id/messages')
  @UseInterceptors(FileInterceptor('attachment', attachmentMulterOptions))
  @ApiOperation({
    summary: 'Create a message in a conversation',
    description:
      'At least one of content or attachment must be provided. Both can be sent together.',
  })
  @ApiCreatedResponse({ type: MessageResponseDto })
  @ApiBadRequestResponse({
    description: 'Message content or attachment is required',
  })
  @ApiForbiddenResponse({
    description: 'Not a participant of this conversation',
  })
  @ApiNotFoundResponse({ description: 'Conversation not found' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', maxLength: 5000 },
        attachment: { type: 'string', format: 'binary' },
      },
    },
  })
  sendMessage(
    @Param('id', ParseIntPipe) conversationId: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 10 * 1024 * 1024 })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    attachment: Express.Multer.File | undefined,
    @Body() sendMessageDto: SendMessageDto,
    @CurrentEstablishmentUser() user: UserWithEstablishment,
  ): Promise<MessageResponseDto> {
    if (!sendMessageDto.content?.trim() && !attachment) {
      throw new BadRequestException(
        'Message content or attachment is required',
      );
    }

    return this.conversationsService.sendMessage(
      conversationId,
      user.establishmentId,
      user.establishmentType,
      sendMessageDto.content ?? '',
      attachment ?? null,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all conversations' })
  @ApiOkResponse({ type: [ConversationResponseDto] })
  getConversations(
    @CurrentEstablishmentUser() user: UserWithEstablishment,
  ): Promise<ConversationResponseDto[]> {
    return this.conversationsService.getConversations(
      user.establishmentId,
      user.establishmentType,
    );
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get total unread messages count' })
  @ApiOkResponse({ type: UnreadCountResponseDto })
  getUnreadCount(
    @CurrentEstablishmentUser() user: UserWithEstablishment,
  ): Promise<UnreadCountResponseDto> {
    return this.conversationsService.getTotalUnreadCount(
      user.establishmentId,
      user.establishmentType,
    );
  }

  @Get(':id/messages/:messageId/attachments/:attachmentId')
  @ApiOperation({ summary: 'Get signed URL for private attachment' })
  @ApiOkResponse({
    description: 'Signed URL for the attachment',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: 'https://bucket.s3...?X-Amz-...' },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Not a participant of this conversation',
  })
  @ApiNotFoundResponse({ description: 'Message or file not found' })
  getAttachment(
    @Param('id', ParseIntPipe) conversationId: number,
    @Param('messageId', ParseIntPipe) messageId: number,
    @Param('attachmentId', ParseIntPipe) attachmentId: number,
    @CurrentEstablishmentUser() user: UserWithEstablishment,
  ): Promise<{ url: string }> {
    return this.conversationsService.getAttachmentSignedUrl(
      conversationId,
      messageId,
      attachmentId,
      user.establishmentId,
      user.establishmentType,
    );
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get messages of a conversation' })
  @ApiOkResponse({ type: [MessageResponseDto] })
  @ApiForbiddenResponse({
    description: 'Not a participant of this conversation',
  })
  @ApiNotFoundResponse({ description: 'Conversation not found' })
  getConversationMessages(
    @Param('id', ParseIntPipe) conversationId: number,
    @CurrentEstablishmentUser() user: UserWithEstablishment,
  ): Promise<MessageResponseDto[]> {
    return this.conversationsService.getConversationMessages(
      conversationId,
      user.establishmentId,
      user.establishmentType,
    );
  }
}
