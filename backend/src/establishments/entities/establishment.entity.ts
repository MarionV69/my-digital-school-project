import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SupplierAttributes } from '../../suppliers/entities/supplier-attributes.entity';
import { EstablishmentType } from '../enums/establishment-type.enum';
import { Favorite } from 'src/favorites/entities/favorite.entity';
import { User } from 'src/users/entities/user.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Document } from 'src/documents/entities/document.entity';
import { Conversation } from 'src/conversations/entities/conversation.entity';

@Entity('establishment')
@Index('idx_establishment_postal_code', ['postalCode'])
@Index('idx_establishment_city', ['city'])
@Index('idx_establishment_coordinates', ['latitude', 'longitude'])
@Index('idx_establishment_type', ['type'])
export class Establishment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: EstablishmentType })
  type: EstablishmentType;

  @Column({ type: 'varchar', length: 14, unique: true })
  siret: string;

  @Column({ name: 'legal_name', type: 'varchar', length: 255 })
  legalName: string;

  @Column({ name: 'trade_name', type: 'varchar', length: 255, nullable: true })
  tradeName: string | null;

  @Column({ name: 'vat_number', type: 'varchar', length: 50, nullable: true })
  vatNumber: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

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

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  instagram: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  facebook: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  // -- Relations --

  // Un établissement  est lié à un ou plusieurs utilisateurs
  @OneToMany(() => User, (user) => user.establishment)
  user: User[];

  // Un établissement (type: 'RESTAURANT') peut avoir plusieurs favoris
  @OneToMany(() => Favorite, (favorite) => favorite.owner)
  favoritesGiven: Favorite[];

  // Un établissement (type: 'SUPPLIER') peut être favori de plusieurs restaurants
  @OneToMany(() => Favorite, (favorite) => favorite.target)
  favoritesReceived: Favorite[];

  // Un établissement (type: 'RESTAURANT') peut laisser des avis sur plusieurs fournisseurs
  @OneToMany(() => Review, (review) => review.owner)
  reviewsGiven: Review[];

  // Un établissement (type: 'SUPPLIER') peut recevoir des avis de plusieurs restaurants
  @OneToMany(() => Review, (review) => review.target)
  reviewsReceived: Review[];

  // Un établissement peut déposer des documents
  @OneToMany(() => Document, (document) => document.establishment)
  documents: Document[];

  // Un restaurant peut avoir plusieurs conversations
  @OneToMany(() => Conversation, (conversation) => conversation.restaurant)
  conversations: Conversation[];

  // Un fournisseur peut avoir plusieurs conversations
  @OneToMany(() => Conversation, (conversation) => conversation.supplier)
  conversationsAsSupplier: Conversation[];

  // Un établissement (type: 'SUPPLIER') a une fiche d'attributs
  @OneToOne(
    () => SupplierAttributes,
    (SupplierAttributes) => SupplierAttributes.supplier,
    { cascade: true, nullable: true },
  )
  supplierAttributes: SupplierAttributes | null;
}
