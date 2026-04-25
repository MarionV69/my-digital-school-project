import { ApiProperty } from '@nestjs/swagger';

export class EstablishmentPreviewDto {
  @ApiProperty({ example: 'Le Gourmet' })
  legalName: string;

  @ApiProperty({ example: 'Paris' })
  city: string;

  @ApiProperty({
    example: 'https://legourmetbistrot.fr',
    nullable: true,
  })
  website: string | null;

  @ApiProperty({
    example: 'https://bucket.s3.amazonaws.com/public/logo.jpg',
    nullable: true,
  })
  avatarUrl: string | null;
}
