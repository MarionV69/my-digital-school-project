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
@Unique('uq_favorite_owner_target', [
  'ownerId',
  'targetId',
])
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'owner_id', type: 'int' })
  ownerId: number;

  @Column({ name: 'target_id', type: 'int' })
  targetId: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  // -- Relations --

  // Chaque favori est lié à un restaurant (owner)
  @ManyToOne( () => Establishment, (establishment) => establishment.favoritesGiven, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'owner_id' })
  owner: Establishment;

  // Chaque favori est lié à un fournisseur (target)
  @ManyToOne( () => Establishment, (establishment) => establishment.favoritesReceived, {
    onDelete: 'CASCADE',
  }) 
  @JoinColumn({ name: 'target_id' })
  target: Establishment;

}
