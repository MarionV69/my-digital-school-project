import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateFavoriteDto {
  @ApiProperty({ example: 1, description: 'ID du fournisseur favori' })
  @IsInt()
  @IsNotEmpty()
  targetId: number;
}
