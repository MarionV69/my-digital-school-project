import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Controller('establishments')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  // Route pour créer un favori
  @Post(':id/favorites')
  create(
    @Param('id') id: string,
    @Body() dto: CreateFavoriteDto) {
      const ownerId = +id;
      const targetId = dto.targetId;
      return this.favoritesService.create(ownerId, targetId);
    }

  // Route pour récupérer tous les favoris d'un restaurant
  @Get(':id/favorites')
  getFavorites(
    @Param('id') id: string) {
    return this.favoritesService.getRestaurantFavorites(+id);
  }

  // Route pour supprimer un favori
  @Delete(':id/favorites/:favoriteId')
  remove(
    @Param('id') id: string,
    @Param('favoriteId') favoriteId: string) {
      const ownerId = +id;
      const favId = +favoriteId;
      return this.favoritesService.remove(ownerId, favId);
  }
}
