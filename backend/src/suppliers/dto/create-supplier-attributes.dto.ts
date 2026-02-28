import { ApiProperty } from '@nestjs/swagger';
import { SupplierType } from '../enums/supplier-type.enum';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PriceRange } from '../enums/price-range.enum';

export class CreateSupplierAttributesDto {
  @ApiProperty({ enum: SupplierType, example: SupplierType.PRODUCER })
  @IsEnum(SupplierType)
  @IsNotEmpty()
  supplierType: SupplierType;

  @ApiProperty({ enum: PriceRange, example: PriceRange.ECONOMIC })
  @IsEnum(PriceRange)
  @IsNotEmpty()
  priceRange: PriceRange;

  @ApiProperty({ example: 100, required: false })
  @IsInt()
  @IsOptional()
  deliveryRadiusKm?: number;

  @ApiProperty({
    example: 'Livraison du lundi au vendredi de 8h à 18h',
    required: false,
  })
  @IsString()
  @IsOptional()
  deliveryInformations: string;

  @ApiProperty({ example: 50.0, required: false })
  @IsNumber()
  @IsOptional()
  minimumOrderAmount?: number;

  @ApiProperty({ example: true, required: false, default: false })
  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;

  @ApiProperty({ example: true, required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}
