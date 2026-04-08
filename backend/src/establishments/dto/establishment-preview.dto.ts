import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EstablishmentPreviewDto {
  @ApiProperty({ example: 'Le Gourmet' })
  legalName: string;

  @ApiProperty({ example: 'Paris' })
  city: string;

  @ApiPropertyOptional({
    example: 'https://legourmetbistrot.fr',
    required: false,
  })
  website?: string | null;

  @ApiPropertyOptional({
    example:
      'https://le-bon-fournisseur-files.s3.eu-west-3.amazonaws.com/public/logo.jpg',
    nullable: true,
  })
  logoUrl?: string | null;
}
