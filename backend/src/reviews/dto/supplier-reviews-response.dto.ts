import { ApiProperty } from '@nestjs/swagger';
import { ReviewResponseDto } from './review-response.dto';

export class SupplierReviewsResponseDto {
  @ApiProperty({ example: 4.2 })
  average: number;

  @ApiProperty({ example: 15 })
  count: number;

  @ApiProperty({ type: [ReviewResponseDto] })
  reviews: ReviewResponseDto[];
}
