import { ApiProperty } from "@nestjs/swagger";

export class LabelDto {

    @ApiProperty({example: 1})
    id: number;

    @ApiProperty({example: "Bio" })
    name: string;

    @ApiProperty({example: "Issu de l'agriculture biologique."})
    description: string;
}