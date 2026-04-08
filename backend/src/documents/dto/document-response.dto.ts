import { ApiProperty } from '@nestjs/swagger';
import { DocumentCategory } from '../enums/document.enum';
import { FileResponseDto } from '../../files/dto/file-response.dto';

export class DocumentResponseDto {
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
