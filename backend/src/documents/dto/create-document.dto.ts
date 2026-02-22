import { IsEnum } from 'class-validator';
import { DocumentCategory } from '../enums/document.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({ enum: DocumentCategory, example: DocumentCategory.CATALOG })
  @IsEnum(DocumentCategory)
  category: DocumentCategory;
}
