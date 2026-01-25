import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { Exclude } from 'class-transformer';

@Entity('user')
@Index(['role'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  @Exclude()
  passwordHash: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ name: 'last_login_at', type: 'datetime', nullable: true })
  lastLoginAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  // Relations
  @OneToOne(() => Restaurant, (restaurant) => restaurant.user)
  restaurant?: Restaurant;

  @OneToOne(() => Supplier, (supplier) => supplier.user)
  supplier?: Supplier;
}
