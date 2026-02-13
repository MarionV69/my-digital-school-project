import {
  Body,
  Controller,
  ForbiddenException,
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
import { CreateSupplierDocumentDto } from './dto/create-supplier-document.dto';
import { SupplierDocumentsService } from './supplier-document.service';
import { UserRole } from '../users/enums/user-role.enum';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { multerPublicOptions } from '../config/multer.config';
import { DocumentCategory } from './enums/document-category.enum';

@ApiTags('supplier-documents')
@ApiBearerAuth()
@Controller('suppliers/:id/documents')
export class SupplierDocumentsController {
  constructor(
    private readonly supplierDocumentsService: SupplierDocumentsService,
  ) {}

  @Post()
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
    @Param('id', ParseIntPipe) supplierId: number,
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
    @Body() dto: CreateSupplierDocumentDto,
  ) {
    if (user.role !== UserRole.SUPPLIER) {
      throw new ForbiddenException('Only suppliers can upload documents');
    }
    return this.supplierDocumentsService.upload(
      supplierId,
      user.id,
      file,
      dto.category,
    );
  }
}
