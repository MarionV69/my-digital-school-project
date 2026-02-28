import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({ example: 3 })
  @IsInt()
  @IsPositive()
  supplierId: number;
}
