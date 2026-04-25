import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateDocumentDto } from '../documents/dto/create-document.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { documentMulterOptions } from '../config/multer.config';
import { DocumentCategory } from '../documents/enums/document.enum';
import { DocumentResponseDto } from '../documents/dto/document-response.dto';
import { DocumentsService } from './documents.service';
import { GroupedDocumentsResponseDto } from './dto/grouped-documents-response.dto';
import { EstablishmentGuard } from 'src/common/guards/establishment.guard';
import { CurrentEstablishmentUser } from 'src/common/decorators/current-establishment-user.decorator';
import { type UserWithEstablishment } from 'src/common/types/user-with-establishment.type';

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(EstablishmentGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a document' })
  @ApiCreatedResponse({ type: DocumentResponseDto })
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
  @UseInterceptors(FileInterceptor('file', documentMulterOptions))
  async upload(
    @CurrentEstablishmentUser() user: UserWithEstablishment,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 15 * 1024 * 1024, // 15MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body() dto: CreateDocumentDto,
  ): Promise<DocumentResponseDto> {
    return this.documentsService.upload(
      user.establishmentId,
      user.establishmentType,
      file,
      dto.category,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all documents grouped by category or filtered',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: DocumentCategory,
    description: 'Filter by category (optional)',
  })
  @ApiOkResponse({
    description: 'Documents grouped by category or array if filtered)',
    type: GroupedDocumentsResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'You must create an establishment before managing documents',
  })
  async findAll(
    @CurrentEstablishmentUser() user: UserWithEstablishment,
    @Query('category') category?: DocumentCategory,
  ): Promise<GroupedDocumentsResponseDto | DocumentResponseDto[]> {
    if (category) {
      return this.documentsService.findByCategory(
        user.establishmentId,
        category,
      );
    }
    return this.documentsService.findAllByEstablishment(user.establishmentId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Document deleted successfully' })
  @ApiNotFoundResponse({ description: 'Document not found' })
  @ApiForbiddenResponse({
    description: 'You must create an establishment before managing documents',
  })
  async delete(
    @CurrentEstablishmentUser() user: UserWithEstablishment,
    @Param('id', ParseIntPipe) documentId: number,
  ): Promise<void> {
    return this.documentsService.delete(documentId, user.establishmentId);
  }
}
