import { ApiPropertyOptional } from '@nestjs/swagger';
import { SupplierListItemDto } from './supplier-list-item.dto';

export class SupplierDetailDto extends SupplierListItemDto {
  @ApiPropertyOptional({
    example:
      'Nous proposons des produits de terroir de qualité et rémunérons nos producteurs à leur juste valeur.',
  })
  description: string | null;

  @ApiPropertyOptional({ example: 100 })
  deliveryRadiusKm: number | null;

  @ApiPropertyOptional({
    example: 'Toutes nos livraisons sont faites entre 8:00 et 10:00.',
  })
  deliveryInformation: string | null;

  @ApiPropertyOptional({ example: 500 })
  minimumOrderAmount: number | null;

  @ApiPropertyOptional({ example: 'https://opterus.fr' })
  website: string | null;

  @ApiPropertyOptional({
    example: 'https://instagram.com/latabledeschefs.podcast/',
  })
  instagram: string | null;

  @ApiPropertyOptional({
    example: 'https://facebook.com/latabledeschefs.podcast/',
  })
  facebook: string | null;

  @ApiPropertyOptional()
  documents?: any[] | null;
}
