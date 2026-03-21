import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { PriceRange } from "../enums/price-range.enum";
import { Transform } from "class-transformer";
import { SupplierType } from "../enums/supplier-type.enum";

export class FilterDto {

    @ApiPropertyOptional({ example: 'PRODUCER', enum: SupplierType})
    @IsEnum(SupplierType)
    @IsOptional()
    supplierType?: string;

    @ApiPropertyOptional({ example: 'Lyon' })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiPropertyOptional({ example: '69530'})
    @IsOptional()
    @IsString()
    postalCode?: string;

    @ApiPropertyOptional({ example: 'MAG' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional( {example: 'ECONOMIC', enum: PriceRange })
    @IsOptional()
    @IsEnum(PriceRange)
    priceRange?: PriceRange;

    @ApiPropertyOptional({example: 'true', default: 'false'})
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    isPremium?: boolean;

    @ApiPropertyOptional({ example: ['Bio', 'AOP'] })
    @IsOptional()
    @IsArray()
    @Transform(({ value }): string[] => (Array.isArray(value) ? value : [value]))
    labels?: string[];

    @ApiPropertyOptional({ example: ['Viandes', 'Poissons'] })
    @IsOptional()
    @IsArray()
    @Transform(({ value }): string[] => (Array.isArray(value) ? value : [value]))
    productCategories?: string[];

}