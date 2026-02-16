import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateFavoriteDto {

    // id de du restaurant qui ajoute le fournisseur en favoris

    @IsInt()
    @IsNotEmpty()
    restaurantId: number;

    // id de du fournisseur qui est ajouté en favoris
    @IsInt()
    @IsNotEmpty()
    supplierId: number;
}