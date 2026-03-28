import { ApiProperty } from '@nestjs/swagger';

export class FileResponseDto {
  @ApiProperty({ example: 12 })
  id: number;

  @ApiProperty({ example: 'catalogue-printemps-2026.pdf' })
  originalFilename: string;

  @ApiProperty({ example: 'application/pdf' })
  mimeType: string;

  @ApiProperty({ example: 245678 })
  size: number;

  @ApiProperty({
    example:
      'https://le-bon-fournisseur-files.s3.eu-west-3.amazonaws.com/public/6de0c398-ea33-445b-aa55-84fe94ed3907.jpg',
  })
  url: string;
}
