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
    example: 'https://bucket.s3.amazonaws.com/public/logo.jpg',
  })
  url: string;
}
