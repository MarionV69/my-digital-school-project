import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SupplierType } from '../enums/supplier-type.enum';
import { PriceRange } from '../enums/price-range.enum';
import { User } from '../../users/entities/user.entity';
import { Label } from './label.entity';
import { ProductCategory } from './product-category.entity';
import { SupplierDocument } from './supplier-document.entity';
import { Conversation } from '../../conversations/entities/conversation.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Favorite } from '../../restaurants/entities/favorite.entity';

@Entity('supplier')
@Index('idx_supplier_postal_code', ['postalCode'])
@Index('idx_supplier_city', ['city'])
@Index('idx_supplier_coordinates', ['latitude', 'longitude'])
@Index('idx_supplier_type', ['supplierType'])
@Index('idx_supplier_is_premium', ['isPremium'])
@Index('idx_supplier_is_visible', ['isVisible'])
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int', unique: true })
  userId: number;

  @Column({ type: 'varchar', length: 14, unique: true })
  siret: string;

  @Column({ name: 'legal_name', type: 'varchar', length: 255 })
  legalName: string;

  @Column({ name: 'trade_name', type: 'varchar', length: 255, nullable: true })
  tradeName: string | null;

  @Column({ name: 'legal_form', type: 'varchar', length: 100, nullable: true })
  legalForm: string | null;

  @Column({ name: 'vat_number', type: 'varchar', length: 50, nullable: true })
  vatNumber: string | null;

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

  @Column({ name: 'supplier_type', type: 'enum', enum: SupplierType })
  supplierType: SupplierType;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'price_range', type: 'enum', enum: PriceRange })
  priceRange: PriceRange;

  @Column({ name: 'delivery_radius_km', type: 'int', nullable: true })
  deliveryRadiusKm: number | null;

  @Column({ name: 'delivery_information', type: 'text', nullable: true })
  deliveryInformation: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  instagram: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  facebook: string | null;

  @Column({
    name: 'minimum_order_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  minimumOrderAmount: number | null;

  @Column({ name: 'is_premium', type: 'boolean', default: false })
  isPremium: boolean;

  @Column({ name: 'is_visible', type: 'boolean', default: true })
  isVisible: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  // Relations
  @OneToOne(() => User, (user) => user.supplier, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Label, (label) => label.suppliers)
  @JoinTable({
    name: 'supplier_label',
    joinColumn: { name: 'supplier_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'label_id', referencedColumnName: 'id' },
  })
  labels: Label[];

  @ManyToMany(() => ProductCategory, (category) => category.suppliers)
  @JoinTable({
    name: 'supplier_product_category',
    joinColumn: { name: 'supplier_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'product_category_id',
      referencedColumnName: 'id',
    },
  })
  productCategories: ProductCategory[];

  @OneToMany(() => SupplierDocument, (doc) => doc.supplier)
  documents: SupplierDocument[];

  @OneToMany(() => Conversation, (conversation) => conversation.supplier)
  conversations: Conversation[];

  @OneToMany(() => Review, (review) => review.supplier)
  reviews: Review[];

  @OneToMany(() => Favorite, (favorite) => favorite.supplier)
  favorites: Favorite[];
}
