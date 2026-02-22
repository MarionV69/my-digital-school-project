import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { SupplierType } from '../enums/supplier-type.enum';
import { PriceRange } from '../enums/price-range.enum';
import { Label } from './label.entity';
import { ProductCategory } from './product-category.entity';
import { Establishment } from '../../establishments/entities/establishment.entity';

@Entity('supplier_attributes')
@Index('idx_supplier_type', ['supplierType'])
@Index('idx_supplier_is_premium', ['isPremium'])
@Index('idx_supplier_is_visible', ['isVisible'])
export class SupplierAttributes {
  @PrimaryColumn({ name: 'supplier_id', type: 'int' })
  supplierId: number;

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

  // -- Relations --

  // Une fiche d'attributs est liée à un seul établissement de type 'SUPPLIER'
  @OneToOne( () => Establishment, (Establishment) => Establishment.supplierAttributes,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'supplier_id' })
  supplier: Establishment;

  @ManyToMany(() => Label, (label) => label.suppliers)
  @JoinTable({
    name: 'supplier_label',
    joinColumn: { name: 'supplier_id', referencedColumnName: 'supplierId' },
    inverseJoinColumn: { name: 'label_id', referencedColumnName: 'id' },
  })
  labels: Label[];

  @ManyToMany(() => ProductCategory, (category) => category.suppliers)
  @JoinTable({
    name: 'supplier_product_category',
    joinColumn: { name: 'supplier_id', referencedColumnName: 'supplierId' },
    inverseJoinColumn: {
      name: 'product_category_id',
      referencedColumnName: 'id',
    },
  })
  productCategories: ProductCategory[];
}
