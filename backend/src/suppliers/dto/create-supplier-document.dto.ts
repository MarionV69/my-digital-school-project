import { IsEnum } from 'class-validator';
import { DocumentCategory } from '../enums/document-category.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDocumentDto {
  @ApiProperty({ enum: DocumentCategory })
  @IsEnum(DocumentCategory)
  category: DocumentCategory;
}
