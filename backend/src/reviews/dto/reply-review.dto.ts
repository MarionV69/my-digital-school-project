import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ReplyReviewDto {
  @ApiProperty({
    example: 'Thank you for your feedback!',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  reply: string;
}
