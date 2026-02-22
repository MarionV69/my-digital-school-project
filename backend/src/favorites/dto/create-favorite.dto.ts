import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator/types/decorator/common/IsNotEmpty";
import { IsInt } from "class-validator/types/decorator/typechecker/IsInt";

export class CreateFavoriteDto {

    @ApiProperty({ example: 1, description: 'ID du fournisseur favori' })
    @IsInt()
    @IsNotEmpty()
    targetId: number;
}
