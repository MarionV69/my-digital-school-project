import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ example: 'Quels sont vos délais de livraison ?' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content: string;
}
