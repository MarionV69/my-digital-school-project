import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { SupplierType } from "../enums/supplier-type.enum";
import { PriceRange } from "../enums/price-range.enum";

export class CreateSupplierAttributesDto {

  @ApiProperty({ enum: SupplierType, example: SupplierType.PRODUCER, default: SupplierType.PRODUCER })
  @IsEnum(SupplierType)
  @IsNotEmpty()
  supplierType: SupplierType;

  @ApiProperty({ enum: PriceRange, example: PriceRange.ECONOMIC, default: PriceRange.ECONOMIC })
  @IsEnum(PriceRange)
  @IsNotEmpty()
  priceRange: PriceRange;

  @ApiPropertyOptional({ example: 100 })
  @IsNumber()
  @IsOptional()
  deliveryRadiusKm?: number;

  @ApiPropertyOptional({ example: 'Les livraisons sont effectuées entre 8h et 10h.'})
  @IsString()
  @IsOptional()
  deliveryInformation?: string;

  @ApiPropertyOptional({ example: 1000 })
  @IsNumber()
  @IsOptional()
  minimumOrderAmount?: number;

  @ApiPropertyOptional({ example: true, default: false})
  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;

  @ApiPropertyOptional({ example: true, default: true})
  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;

  // Labels
  @ApiPropertyOptional({ example: [1, 2] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true})
  labels?: number[];

  // ProductCategories
  @ApiPropertyOptional({ example: [1, 2] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true})
  productCategories?: number[];

}
