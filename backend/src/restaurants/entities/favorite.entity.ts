import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';

@Entity('favorite')
@Unique('uq_favorite_restaurant_supplier', [
  'restaurantId',
  'favoritedSupplierId',
])
@Index(['restaurantId'])
@Index(['favoritedSupplierId'])
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'restaurant_id', type: 'int' })
  restaurantId: number;

  @Column({ name: 'favorited_supplier_id', type: 'int' })
  favoritedSupplierId: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @ManyToOne(() => Supplier, (supplier) => supplier.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'favorited_supplier_id' })
  supplier: Supplier;
}
