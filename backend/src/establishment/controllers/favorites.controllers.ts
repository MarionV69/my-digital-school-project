// Routes pour gérer les favoris des restaurants

import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { FavoritesService } from '../services/favorites.service';
import { CreateFavoriteDto } from '../dto/create-favorite.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('restaurants/favorites')
@ApiBearerAuth()
@Controller('restaurants/favorites')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  // POST /favorites - Ajouter un fournisseur en favoris
  @Post()
  addFavorite(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.addFavorite(createFavoriteDto);
  }

  // DELETE /favorites - Supprimer un fournisseur des favoris
  @Delete()
  removeFavorite(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.removeFavorite(createFavoriteDto);
  }

  // GET /favorites/restaurant/:restaurantId - Liste des favoris
  @Get('restaurant/:restaurantId')
  getFavoritesByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.favoritesService.findAllByRestaurants(+restaurantId);
  }

  // GET /favorites/check - Vérifier si un fournisseur est en favoris
  @Get('check')
  isFavorite(
    @Query('restaurantId') restaurantId: string,
    @Query('supplierId') supplierId: string,
  ) {
    return this.favoritesService.isFavorite(+restaurantId, +supplierId);
  }
} 