import { ApiProperty } from "@nestjs/swagger";

export class SupplierStatsDto {

    @ApiProperty({ example: 82 })
    favoriteCount: number;

    @ApiProperty({ example: 4.5 })
    averageRating: number;

    @ApiProperty({ example: 25 })
    reviewCount: number;

}