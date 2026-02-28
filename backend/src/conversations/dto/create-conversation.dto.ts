import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  supplierId: number;
}
