import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RestaurantType } from '../enums/restaurant-type.enum';
import { User } from '../../users/entities/user.entity';
import { Conversation } from '../../conversations/entities/conversation.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Favorite } from './favorite.entity';

@Entity('restaurant')
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int', unique: true })
  userId: number;

  @Column({ type: 'varchar', length: 14, unique: true })
  siret: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ name: 'postal_code', type: 'varchar', length: 10 })
  postalCode: string;

  @Column({ type: 'varchar', length: 100, default: 'FRANCE' })
  country: string;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  latitude: number | null;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  longitude: number | null;

  @Column({ type: 'enum', enum: RestaurantType })
  type: RestaurantType;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, (user) => user.restaurant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Conversation, (conversation) => conversation.restaurant)
  conversations: Conversation[];

  @OneToMany(() => Review, (review) => review.restaurant)
  reviews: Review[];

  @OneToMany(() => Favorite, (favorite) => favorite.restaurant)
  favorites: Favorite[];
}
