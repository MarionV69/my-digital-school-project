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
import { Establishment } from '../../establishments/entities/establishment.entity';

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

  // -- Relations --

  // Chaque avis est lié à un restaurant (reviewer)
  @ManyToOne(
    () => Establishment,
    (establishment) => establishment.reviewsGiven,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'reviewer_restaurant_id' })
  owner: Establishment;

  // Chaque avis est lié à un fournisseur (target)
  @ManyToOne(
    () => Establishment,
    (establishment) => establishment.reviewsReceived,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'reviewed_supplier_id' })
  target: Establishment;
}
