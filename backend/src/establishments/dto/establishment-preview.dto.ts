import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class EstablishmentPreviewDto {

    @ApiProperty({ example: 'Le Gourmet' })
    legalName: string;

    @ApiProperty({ example: 'Paris' })
    city: string;

    @ApiPropertyOptional({ example: 'https://legourmetbistrot.fr', required: false })
    website?: string;

}