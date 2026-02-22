import { ApiProperty } from '@nestjs/swagger';
import { GroupedDocumentItemDto } from './grouped-documents-item.dto';

export class GroupedDocumentsResponseDto {
  @ApiProperty({ type: [GroupedDocumentItemDto] })
  LOGO: GroupedDocumentItemDto[];

  @ApiProperty({ type: [GroupedDocumentItemDto] })
  COVER_PHOTO: GroupedDocumentItemDto[];

  @ApiProperty({ type: [GroupedDocumentItemDto] })
  CATALOG: GroupedDocumentItemDto[];

  @ApiProperty({ type: [GroupedDocumentItemDto] })
  GALLERY_PHOTO: GroupedDocumentItemDto[];
}
