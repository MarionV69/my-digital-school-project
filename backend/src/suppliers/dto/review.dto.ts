import { ApiProperty } from '@nestjs/swagger';

export class ReviewDto {
  @ApiProperty({ example: 'Le Gourmet Restaurant' })
  reviewerRestaurant: string;

  @ApiProperty({ example: 4 })
  rating: number;

  @ApiProperty({
    example:
      'Livraison rapide et produits de qualité. Je recommande ce fournisseur !',
  })
  comment: string;

  @ApiProperty({ example: '2024-06-01T12:34:56Z' })
  createdAt: Date;
}
