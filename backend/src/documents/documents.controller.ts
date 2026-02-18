import {
  //   Body,
  Controller,
  //   HttpStatus,
  //   Param,
  //   ParseFilePipeBuilder,
  //   ParseIntPipe,
  //   Post,
  //   UploadedFile,
  //   UseInterceptors,
} from '@nestjs/common';
// import { type AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
// import { CurrentUser } from '../common/decorators/current-user.decorator';
// import { CreateSupplierDocumentDto } from '../documents/dto/create-document.dto';
// import {
//   ApiBadRequestResponse,
//   ApiBearerAuth,
//   ApiBody,
//   ApiConsumes,
//   ApiForbiddenResponse,
//   ApiNotFoundResponse,
//   ApiOkResponse,
//   ApiTags,
//   ApiUnprocessableEntityResponse,
// } from '@nestjs/swagger';
// import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
// import { multerPublicOptions } from '../config/multer.config';
// import { DocumentCategory } from '../documents/enums/document.enum';
// import { SupplierDocumentResponseDto } from '../documents/dto/document-response.dto';
import { DocumentsService } from './documents.service';

// @ApiTags('supplier-documents')
// @ApiBearerAuth()
@Controller('suppliers/:id/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  // @Post()
  // @ApiOkResponse({ type: SupplierDocumentResponseDto })
  // @ApiBadRequestResponse({
  //   description: 'Invalid file type or category limit reached',
  // })
  // @ApiForbiddenResponse({ description: 'Only suppliers can upload documents' })
  // @ApiNotFoundResponse({
  //   description: 'Supplier not found or not owned by user',
  // })
  // @ApiUnprocessableEntityResponse({
  //   description: 'File validation failed (size, format)',
  // })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //       category: {
  //         type: 'string',
  //         enum: Object.values(DocumentCategory),
  //       },
  //     },
  //   },
  // })
  // @UseInterceptors(FileInterceptor('file', multerPublicOptions))
  // async upload(
  //   @Param('id', ParseIntPipe) supplierId: number,
  //   @CurrentUser() user: AuthenticatedUser,
  //   @UploadedFile(
  //     new ParseFilePipeBuilder()
  //       .addMaxSizeValidator({
  //         maxSize: 10 * 1024 * 1024, // 10MB
  //       })
  //       .build({
  //         errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  //       }),
  //   )
  //   file: Express.Multer.File,
  //   @Body() dto: CreateSupplierDocumentDto,
  // ) {
  //   return this.documentsService.upload(
  //     user.establishmentId,
  //     file,
  //     dto.category,
  //   );
  // }
}
