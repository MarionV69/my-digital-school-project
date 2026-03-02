// review-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ReviewResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 4 })
  rating: number;

  @ApiProperty({ example: 'Great supplier, deliveries always on time.' })
  comment: string;

  @ApiProperty({ example: 'Thank you for your feedback!', nullable: true })
  reply: string | null;

  @ApiProperty({ example: '2026-02-26T20:15:25.000Z', nullable: true })
  repliedAt: Date | null;

  @ApiProperty({ example: '2026-02-22T13:49:30.000Z' })
  createdAt: Date;

  @ApiProperty({ example: { id: 3, name: 'Le Petit Bistrot' } })
  reviewer: {
    id: number;
    name: string;
  };
}
