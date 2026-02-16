// Logique métier pour gérer les favoris des restaurants
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';
import { Restaurant } from '../entities/establishment.entity';
import { CreateFavoriteDto } from '../dto/create-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  // Récupérer tous les favoris d'un restaurant
  async findAllByRestaurants(restaurantId: number): Promise<Favorite[]> {
    return await this.favoriteRepository.find({
      where: { restaurantId },
      relations: ['supplier'], 
    });
  }

  // Vérifier si un fournisseur est déjà en favoris
  async isFavorite(restaurantId: number, supplierId: number): Promise<boolean> {
    const favorite = await this.favoriteRepository.findOne({
      where: {
        restaurantId,
        favoritedSupplierId: supplierId,
      },
    });
    return !!favorite;
  } 

  // Ajouter un fournisseur en favoris
  async addFavorite(dto: CreateFavoriteDto): Promise<Favorite> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: dto.restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant ${dto.restaurantId} introuvable`);
    }

    const favorite = this.favoriteRepository.create({
      restaurantId: dto.restaurantId,
      favoritedSupplierId: dto.supplierId, 
    });

    return await this.favoriteRepository.save(favorite);
  }

  // Supprimer un fournisseur des favoris
  async removeFavorite(dto: CreateFavoriteDto): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: {
        restaurantId: dto.restaurantId,
        favoritedSupplierId: dto.supplierId,
      },
    });

    if (!favorite) { 
      throw new NotFoundException(`Favori introuvable`);
    }

    await this.favoriteRepository.remove(favorite);
  }
}