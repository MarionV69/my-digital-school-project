import { ApiProperty } from '@nestjs/swagger';
import { DocumentCategory } from '../enums/document-category.enum';
import { FileResponseDto } from '../../files/dto/FileResponse.dto';

export class SupplierDocumentResponseDto {
  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty({
    enum: DocumentCategory,
    example: DocumentCategory.CATALOG,
  })
  category: DocumentCategory;

  @ApiProperty({ type: FileResponseDto })
  file: FileResponseDto;
}
