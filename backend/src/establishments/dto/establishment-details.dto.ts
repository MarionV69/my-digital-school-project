import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class EstablishmentDetailsDto {

    @ApiProperty({ example: '12345678901234' })
    siret: string;

    @ApiProperty({ example: 'Le Gourmet'})
    legalName: string;

    @ApiPropertyOptional({ example: 'Le Gourmet Bistro', required: false })
    tradeName?: string | null;

    @ApiPropertyOptional({ example: 'FR 12345678901234', required: false })
    vatNumber?: string | null;

    @ApiPropertyOptional({ example: 'legourmetbistrot@gmail.com', required: false })
    email?: string | null;

    @ApiPropertyOptional({ example: '0123456789', required: false })
    phone?: string | null;

    @ApiProperty({ example: '15 rue de la Paix, 75002 Paris' })
    address: string;

    @ApiProperty({ example: 'Paris' })
    city: string;

    @ApiProperty({ example: '75002' })
    postalCode: string;

    @ApiProperty({ example: 'France' })
    country: string;

    @ApiPropertyOptional({ example: 'Nous sommes un établissement de restauration spécialisé dans la cuisine française traditionnelle.', required: false })
    description?: string | null;

    @ApiPropertyOptional({ example: 'https://legourmetbistrot.fr', required: false })
    website?: string | null;

    @ApiPropertyOptional({ example: 'https://instagram.com/legourmetbistrot', required: false })
    instagram?: string | null;

    @ApiPropertyOptional({ example: 'https://facebook.com/legourmetbistrot', required: false })
    facebook?: string | null;

    @ApiPropertyOptional({ example: 'https://le-bon-fournisseur-files.s3.eu-west-3.amazonaws.com/public/logo.jpg', nullable: true })
    logoUrl?: string | null;

    @ApiPropertyOptional({ example: 'https://le-bon-fournisseur-files.s3.eu-west-3.amazonaws.com/public/cover.jpg', nullable: true })
    coverPhotoUrl?: string | null;

    @ApiPropertyOptional({ example: 'https://le-bon-fournisseur-files.s3.eu-west-3.amazonaws.com/public/catalog.pdf', nullable: true })
    catalogUrl?: string | null;

    @ApiPropertyOptional({   example: [
      'https://le-bon-fournisseur-files.s3.eu-west-3.amazonaws.com/public/photo1.jpg',
      'https://le-bon-fournisseur-files.s3.eu-west-3.amazonaws.com/public/photo2.jpg',
    ],
    required: false,})
    galleryPhotos?: string[];

}