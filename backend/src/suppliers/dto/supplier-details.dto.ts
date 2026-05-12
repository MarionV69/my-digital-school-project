import { ApiPropertyOptional } from '@nestjs/swagger';
import { SupplierListItemDto } from './supplier-list-item.dto';
import { ReviewDto } from './review.dto';
import { FileResponseDto } from 'src/files/dto/file-response.dto';
import { SupplierType } from '../enums/supplier-type.enum';

export class SupplierDetailDto extends SupplierListItemDto {
  @ApiPropertyOptional({
    enum: SupplierType,
    example: SupplierType.PRODUCER,
  })
  supplierType: SupplierType;

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

  @ApiPropertyOptional({ type: [FileResponseDto] })
  catalogs: FileResponseDto[];

  @ApiPropertyOptional({
    example: [
      'https://le-bon-fournisseur-files.s3.eu-west-3.amazonaws.com/public/photo1.jpg',
      'https://le-bon-fournisseur-files.s3.eu-west-3.amazonaws.com/public/photo2.jpg',
    ],
    type: [String],
  })
  galleryPhotos: string[];

  @ApiPropertyOptional({
    type: [ReviewDto],
    example: [
      {
        reviewerRestaurant: 'Le Gourmet',
        rating: 4,
        comment: 'Très bons produits !',
        createdAt: '2024-06-01T12:34:56Z',
      },
    ],
  })
  reviews: ReviewDto[];

  @ApiPropertyOptional({
    example: false,
  })
  isVisible: boolean;

}
