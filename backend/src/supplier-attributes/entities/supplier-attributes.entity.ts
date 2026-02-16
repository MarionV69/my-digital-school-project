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
import { Favorite } from '../../establishment/entities/favorite.entity';
import { Establishment } from 'src/establishment/entities/establishment.entity';

@Entity('supplier_attributes')
@Index('idx_supplier_type', ['supplierType'])
@Index('idx_supplier_is_premium', ['isPremium'])
@Index('idx_supplier_is_visible', ['isVisible'])

export class SupplierAttributes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'establishment_id', type: 'int', unique: true })
  establishmentId: number;

  @Column({ type: 'varchar', length: 255})
  legalName: string;

  @Column({type: 'varchar', length: 255, nullable: true})
  tradeName: string | null;

  @Column({ name: 'legal_form', type: 'varchar', length: 100, nullable: true })
  legalForm: string | null;

  @Column({ name: 'vat_number', type: 'varchar', length: 50, nullable: true })
  vatNumber: string | null;

  @Column({ name: 'supplier_type', type: 'enum', enum: SupplierType })
  supplierType: SupplierType;

  @Column({ name: 'price_range', type: 'enum', enum: PriceRange })
  priceRange: PriceRange;

  @Column({ name: 'delivery_radius_km', type: 'int', nullable: true })
  deliveryRadiusKm: number | null;

  @Column({ name: 'delivery_information', type: 'text', nullable: true })
  deliveryInformation: string | null;

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

  // -- Relations --

  // Les attributs d'un fournisseur sont liés à un établissement (obligatoire)
  @OneToOne(() => Establishment, (establishment) => establishment.supplier, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'establishment_id' })
  establishment: Establishment;

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

}
