import { ApiProperty } from '@nestjs/swagger';
import { FileResponseDto } from '../../files/dto/FileResponse.dto';

export class GroupedDocumentItemDto {
  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty({ type: FileResponseDto })
  file: FileResponseDto;
}
