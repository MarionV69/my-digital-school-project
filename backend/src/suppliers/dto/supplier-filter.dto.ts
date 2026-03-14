import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { PriceRange } from "../enums/price-range.enum";
import { Transform } from "class-transformer";

export class FilterDto {

    @ApiPropertyOptional({ example: 'Lyon' })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiPropertyOptional({ example: 'MAG' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional( {example: 'ECONOMIC', enum: PriceRange })
    @IsOptional()
    @IsEnum(PriceRange)
    priceRange?: PriceRange;

    @ApiPropertyOptional({ example: ['Bio', 'AOP'] })
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    labels?: string[];

    @ApiPropertyOptional({ example: ['Viandes', 'Poissons'] })
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    productCategories?: string[];

}