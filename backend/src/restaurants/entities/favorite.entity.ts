import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Establishment } from '../../establishments/entities/establishment.entity';

@Entity('favorite')
@Unique('uq_favorite_restaurant_supplier', [
  'restaurantId',
  'favoritedSupplierId',
])
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'restaurant_id', type: 'int' })
  owner_id: number;

  @Column({ name: 'favorited_supplier_id', type: 'int' })
  target_id: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Establishment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurant_id' })
  owner: Establishment;

  @ManyToOne(() => Establishment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'target_id' })
  target: Establishment;
}
