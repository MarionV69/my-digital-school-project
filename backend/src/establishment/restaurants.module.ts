import { Module } from '@nestjs/common';
import { RestaurantsService } from './services/restaurants.service';
import { RestaurantsController } from './controllers/restaurants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/establishment.entity';
import { Favorite } from './entities/favorite.entity';
import { FavoritesService } from './services/favorites.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Favorite])],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, FavoritesService],
  exports: [RestaurantsService, FavoritesService],
})
export class RestaurantsModule {}
