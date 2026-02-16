import { IsEnum, isInt, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, MaxLength } from "class-validator";
import { RestaurantType } from "../enums/restaurant-type.enum";

// Logique métier pour la création d'un restaurant
export class CreateRestaurantDto {

    // id de l'utilisateur propriétaire du restaurant
    @IsInt()
    @IsNotEmpty()
    userId: number;

    // n°SIRET du restaurant
    @IsString()
    @IsNotEmpty()
    @Length(14, 14)
    siret: string;

    // nom du restaurant
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    name: string;

    // adresse du restaurant
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    address: string;

    // ville du restaurant
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    city: string;

    // code postal du restaurant
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    postalCode: string;

    // pays du restaurant
    @IsString()
    @IsOptional()
    @MaxLength(100)
    country?: string;

    // type de restaurant (ex: "Fast Food", "Gastronomique", etc.)
    @IsEnum(RestaurantType)
    @IsNotEmpty()
    type: RestaurantType;

    // latitude du restaurant
    @IsNumber()
    @IsOptional()
    latitude?: number;

    // longitude du restaurant
    @IsNumber()
    @IsOptional()
    longitude?: number;

}
