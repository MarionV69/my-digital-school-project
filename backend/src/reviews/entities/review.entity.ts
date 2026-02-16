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
import { ReviewStatus } from '../enums/review-status.enum';
import { Restaurant } from '../../establishment/entities/establishment.entity';
import { Supplier } from '../../supplier-attributes/entities/supplier-attributes.entity';

@Entity('review')
@Unique('uq_review_restaurant_supplier', [
  'reviewerRestaurantId',
  'reviewedSupplierId',
])
@Index(['reviewerRestaurantId'])
@Index(['reviewedSupplierId'])
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'reviewer_restaurant_id', type: 'int' })
  reviewerRestaurantId: number;

  @Column({ name: 'reviewed_supplier_id', type: 'int' })
  reviewedSupplierId: number;

  @Column({ type: 'tinyint' })
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'enum', enum: ReviewStatus, default: ReviewStatus.PUBLISHED })
  status: ReviewStatus;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reviewer_restaurant_id' })
  restaurant: Restaurant;

  @ManyToOne(() => Supplier, (supplier) => supplier.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reviewed_supplier_id' })
  supplier: Supplier;
}
