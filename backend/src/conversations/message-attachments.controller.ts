import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  ParseFilePipeBuilder,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { type AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { EstablishmentGuard } from '../common/guards/establishment.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerPrivateOptions } from '../config/multer.config';
import { MessageAttachmentResponseDto } from './dto/message-attachments-response.dto';
import { ConversationsService } from './conversations.service';

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(EstablishmentGuard)
@Controller('messages')
export class MessageAttachmentsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post(':messageId/attachments')
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
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', multerPrivateOptions))
  sendAttachment(
    @Param('messageId', ParseIntPipe) messageId: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 10 * 1024 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<MessageAttachmentResponseDto> {
    return this.conversationsService.sendAttachment(
      messageId,
      user.establishmentId!,
      user.establishmentType!,
      file,
    );
  }

  @Get(':messageId/attachments/:fileId')
  @ApiOperation({ summary: 'Stream a private attachment' })
  @ApiOkResponse({ description: 'File stream' })
  @ApiForbiddenResponse({
    description: 'Not a participant of this conversation',
  })
  @ApiNotFoundResponse({ description: 'Message or file not found' })
  getAttachment(
    @Param('messageId', ParseIntPipe) messageId: number,
    @Param('fileId', ParseIntPipe) fileId: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<StreamableFile> {
    return this.conversationsService.streamAttachment(
      messageId,
      fileId,
      user.establishmentId!,
      user.establishmentType!,
    );
  }
}
