import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { type AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateDocumentDto } from '../documents/dto/create-document.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { multerPublicOptions } from '../config/multer.config';
import { DocumentCategory } from '../documents/enums/document.enum';
import { DocumentResponseDto } from '../documents/dto/document-response.dto';
import { DocumentsService } from './documents.service';
import { GroupedDocumentsResponseDto } from './dto/grouped-documents-response.dto';

@ApiTags('documents')
@ApiBearerAuth()
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiOkResponse({ type: DocumentResponseDto })
  @ApiBadRequestResponse({
    description: 'Invalid file type or category limit reached',
  })
  @ApiForbiddenResponse({
    description:
      'No establishment, or category not allowed for your establishment type',
  })
  @ApiUnprocessableEntityResponse({
    description: 'File validation failed (size, format)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        category: {
          type: 'string',
          enum: Object.values(DocumentCategory),
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', multerPublicOptions))
  async upload(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 10 * 1024 * 1024, // 10MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body() dto: CreateDocumentDto,
  ) {
    if (user.establishmentId === null) {
      throw new ForbiddenException(
        'You must create an establishment before managing documents',
      );
    }

    return this.documentsService.upload(
      user.establishmentId,
      user.establishmentType,
      file,
      dto.category,
    );
  }

  @Get()
  @ApiOkResponse({
    description: 'Documents grouped by category',
    type: GroupedDocumentsResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'You must create an establishment before managing documents',
  })
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<GroupedDocumentsResponseDto> {
    if (user.establishmentId === null) {
      throw new ForbiddenException(
        'You must create an establishment before managing documents',
      );
    }

    return this.documentsService.findAllByEstablishment(user.establishmentId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Document deleted successfully' })
  @ApiNotFoundResponse({ description: 'Document not found' })
  @ApiForbiddenResponse({
    description: 'You must create an establishment before managing documents',
  })
  async delete(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) documentId: number,
  ) {
    if (user.establishmentId === null) {
      throw new ForbiddenException(
        'You must create an establishment before managing documents',
      );
    }

    return this.documentsService.delete(documentId, user.establishmentId);
  }
}
