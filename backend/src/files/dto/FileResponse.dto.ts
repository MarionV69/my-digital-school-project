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
      'http://localhost:3000/documents/550e8400-e29b-41d4-a716-446655440000.pdf',
  })
  url: string;
}
