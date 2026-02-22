import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injector } from '@nestjs/core/injector/injector';
import { Establishment } from 'src/establishments/entities/establishment.entity';
import { EstablishmentType } from 'src/establishments/enums/establishment-type.enum';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepo: Repository<Favorite>,

    @InjectRepository(Establishment)
    private establishmentRepo: Repository<Establishment>
  ) {}

  // Méthode pour créer un favori
  async create(restaurantId: number, supplierId: number): Promise<Favorite> {
    // Vérifier que le restaurant existe et est bien de type RESTAURANT
    const restaurant = await this.establishmentRepo.findOne({ 
      where: {id: restaurantId,
      type: EstablishmentType.RESTAURANT
      }
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${restaurantId} not found`);
    }

    // Vérifier que le fournisseur existe et est bien de type SUPPLIER
    const supplier = await this.establishmentRepo.findOne({ 
      where: {id: supplierId,
      type: EstablishmentType.SUPPLIER
      }
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${supplierId} not found`);
    }

    // Vérifier que le favori n'existe pas déjà
    const existingFavorite = await this.favoriteRepo.findOne({
      where: {
        ownerId: restaurantId,
        targetId: supplierId
      }
    });
    if (existingFavorite) {
      throw new NotFoundException(`Favorite already exists between restaurant ID ${restaurantId} and supplier ID ${supplierId}`);
    }

    // Créer et sauvegarder le favori
    const favorite = this.favoriteRepo.create({
      ownerId: restaurantId,
      targetId: supplierId
    });

    return await this.favoriteRepo.save(favorite);
  }

  // Méthode pour récupérer tous les favoris d'un restaurant
  async getRestaurantFavorites(restaurantId: number): Promise<Favorite[]> {
    return await this.favoriteRepo.find({
      where: {
        ownerId: restaurantId,
      },
      relations: ['target'],
    });
  }

  // Méthode pour supprimer un favori
  async remove(restaurantId: number, favoriteId: number): Promise<void> {
    const favorite = await this.favoriteRepo.findOne({
      where: {
        id: favoriteId,
        ownerId: restaurantId
      }
    });

    if (!favorite) {
      throw new NotFoundException(`Favorite ${favoriteId} not found for restaurant ID ${restaurantId}`);
    }

    await this.favoriteRepo.remove(favorite);
  }

}
