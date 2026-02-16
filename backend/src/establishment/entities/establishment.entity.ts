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
import { User } from '../../users/entities/user.entity';
import { Conversation } from '../../conversations/entities/conversation.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Favorite } from './favorite.entity';
import { EstablishmentType } from '../enums/establishment-type.enum';
import { supplierAttributes } from 'src/supplier-attributes/entities/supplier-attributes.entity';

@Entity('establishment')
export class Establishment {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profilePicture: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bannerPicture: string | null;

  @Column({ type: 'varchar', length: 150 })
  email: string;

  @Column({ type:'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  instagram: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  facebook: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkedin: string | null;

  @Column({ type: 'enum', enum: EstablishmentType })
  type: EstablishmentType;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  // -- Relations --

  // Un établissement est lié à plusieurs utilisateurs (ex: employés, gérants)
  @OneToMany(() => User, (user) => user.establishment)
  users: User[];

  // Un établissement peut avoir plusieurs conversations
  @OneToMany(() => Conversation, (conversation) => conversation.establishment)
  conversations: Conversation[];

  // Un établissement peut avoir plusieurs avis
  @OneToMany(() => Review, (review) => review.establishment)
  reviews: Review[];

  // Si c'est un fournisseur, il est lié à SupplierParams
  @OneToOne(() => supplierAttributes, (supplier) => supplier.establishment)
  supplier?: supplierAttributes;

  // Favori donnés (si je suis un restaurant)
  @OneToMany(() => Favorite, (favorite) => favorite.restaurant)
  favoritesGiven: Favorite[];

  // Favori reçus (si je suis un fournisseur)
  @OneToMany(() => Favorite, (favorite) => favorite.supplier)
  favoritesReceived: Favorite[];
}
