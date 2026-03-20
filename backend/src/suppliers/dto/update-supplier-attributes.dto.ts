import { ApiPropertyOptional } from "@nestjs/swagger";
import { SupplierType } from "../enums/supplier-type.enum";
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import { PriceRange } from "../enums/price-range.enum";

export class UpdateSupplierAttributesDto {

  @ApiPropertyOptional({ enum: SupplierType, example: SupplierType.PRODUCER })
  @IsEnum(SupplierType)
  @IsOptional()
  supplierType: SupplierType;

  @ApiPropertyOptional({ enum: PriceRange, example: PriceRange.ECONOMIC })
  @IsEnum(PriceRange)
  @IsOptional()
  priceRange: PriceRange;

  @ApiPropertyOptional({ example: 100, required: false })
  @IsInt()
  @IsOptional()
  deliveryRadiusKm?: number;

  @ApiPropertyOptional({
    example: 'Livraison du lundi au vendredi de 8h à 18h',
    required: false,
  })
  @IsString()
  @IsOptional()
  deliveryInformations?: string;

  @ApiPropertyOptional({ example: 50.0, required: false })
  @IsNumber()
  @IsOptional()
  minimumOrderAmount?: number;

  @ApiPropertyOptional({ example: true, required: false, default: false })
  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;

  @ApiPropertyOptional({ example: true, required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}
