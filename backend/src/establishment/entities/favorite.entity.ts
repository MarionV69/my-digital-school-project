import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Establishment } from './establishment.entity';
import { Supplier } from '../../supplier-attributes/entities/supplier-attributes.entity';

@Entity('favorite')
export class Favorite {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'restaurant_id', type: 'int' })
  restaurantId: number;

  @Column({ name: 'supplier_id', type: 'int' })
  supplierId: number;

  @Unique('uq_favorite_restaurant_supplier', [
  'restaurantId',
  'supplierId',
  ])

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  // -- Relations --

  // Celui qui met en favori est un restaurant
  @ManyToOne(() => Establishment, (establishment) => establishment.favoritesGiven, { onDelete: 'CASCADE'})
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Establishment;

  // Celui qui est mis en favori est un fournisseur
  @ManyToOne(() => Establishment, (establishment) => establishment.favoritedReceived, { onDelete: 'CASCADE'})
  @JoinColumn({ name: 'supplier_id' })
  supplier: Establishment;
}
