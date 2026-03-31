import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class EstablishmentDetailsDto {

    @ApiProperty({ example: '12345678901234' })
    siret: string;

    @ApiProperty({ example: 'Le Gourmet'})
    legalName: string;

    @ApiPropertyOptional({ example: 'Le Gourmet Bistro', required: false })
    tradeName?: string;

    @ApiPropertyOptional({ example: 'FR 12345678901234', required: false })
    vatNumber?: string;

    @ApiPropertyOptional({ example: 'legourmetbistrot@gmail.com', required: false })
    email?: string;

    @ApiPropertyOptional({ example: '0123456789', required: false })
    phone?: string;

    @ApiProperty({ example: '15 rue de la Paix, 75002 Paris' })
    address: string;

    @ApiProperty({ example: 'Paris' })
    city: string;

    @ApiProperty({ example: '75002' })
    postalCode: string;

    @ApiProperty({ example: 'France' })
    country: string;

    @ApiPropertyOptional({ example: 'Nous sommes un établissement de restauration spécialisé dans la cuisine française traditionnelle.', required: false })
    description?: string;

    @ApiPropertyOptional({ example: 'https://legourmetbistrot.fr', required: false })
    website?: string;

    @ApiPropertyOptional({ example: 'https://instagram.com/legourmetbistrot', required: false })
    instagram?: string;

    @ApiPropertyOptional({ example: 'https://facebook.com/legourmetbistrot', required: false })
    facebook?: string;

}