import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ example: 'Quels sont vos délais de livraison ?' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  content?: string;
}
