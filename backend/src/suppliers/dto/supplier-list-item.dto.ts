import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PriceRange } from '../enums/price-range.enum';

export class SupplierListItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'MAG ' })
  name: string;

  @ApiProperty({ example: 'Lyon ' })
  city: string;

  @ApiProperty({ example: 'ECONOMIC', enum: PriceRange })
  priceRange: PriceRange;

  @ApiPropertyOptional({ example: ['Bio', 'AOP'] })
  labels?: string[];

  @ApiPropertyOptional({ example: ['Viandes', 'Poissons'] })
  productCategories?: string[];
}
