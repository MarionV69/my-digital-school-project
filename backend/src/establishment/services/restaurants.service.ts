// Logique métier pour gérer les restaurants
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from '../dto/create-restaurant.dto';
import { Restaurant } from '../entities/establishment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';
import { UpdateRestaurantDto } from '../dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,

    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
  ) {}

  // Récupérer tous les restaurants
  async findAll(): Promise<Restaurant[]> {
   return await this.restaurantRepository.find()
  }

  // Récupérer un restaurant par son ID
async findOne(id: number): Promise<Restaurant> {
  const restaurant = await this.restaurantRepository.findOne({ where: { id }, relations: ['user', 'favorites']
  });
  if (!restaurant) {
    throw new NotFoundException(`Restaurant with id ${id} not found`);
  }
  return restaurant;
}

  // Créer un restaurant
  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const restaurant = this.restaurantRepository.create({
      userId: createRestaurantDto.userId,
      siret: createRestaurantDto.siret.replace(/\s/g, ''),
      name: createRestaurantDto.name,
      address: createRestaurantDto.address,
      city: createRestaurantDto.city,
      postalCode: createRestaurantDto.postalCode,
      country: createRestaurantDto.country || 'FRANCE',
      type: createRestaurantDto.type,
      latitude: createRestaurantDto.latitude,
      longitude: createRestaurantDto.longitude,
    });

    return await this.restaurantRepository.save(restaurant);
  }

  // Modifier un restaurant
  async update(id: number, updateRestaurantDto: UpdateRestaurantDto): Promise<Restaurant> {
    const restaurant = await this.findOne(id);
    Object.assign(restaurant, updateRestaurantDto);return await this.restaurantRepository.save(restaurant);
  }

  // Supprimer un restaurant
  async remove(id: number): Promise<void> {
    const restaurant = await this.findOne(id);
    await this.restaurantRepository.remove(restaurant);
  }
}
