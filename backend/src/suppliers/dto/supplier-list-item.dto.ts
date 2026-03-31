import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PriceRange } from '../enums/price-range.enum';

export class SupplierListItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'MAG ' })
  name: string;

  @ApiProperty({ example: 'Lyon ' })
  city: string;

  @ApiProperty({ example: '69001' })
  postalCode: string;

  @ApiProperty({ example: 'ECONOMIC', enum: PriceRange })
  priceRange: PriceRange;

  @ApiProperty({ example: true, default: false })
  isPremium: boolean;

  @ApiPropertyOptional({ example: ['Bio', 'AOP'] })
  labels?: string[];

  @ApiPropertyOptional({ example: ['Viandes', 'Poissons'] })
  productCategories?: string[];

  @ApiPropertyOptional({ example: 'https://le-bon-fournisseur-files.s3.eu-west-3.amazonaws.com/public/logo.jpg', nullable: true })
  logoUrl?: string | null;

  @ApiPropertyOptional({ example: 'https://le-bon-fournisseur-files.s3.eu-west-3.amazonaws.com/public/cover.jpg', nullable: true })
  coverPhotoUrl?: string | null;
}
