import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SupplierAttributes } from './supplier-attributes.entity';

@Entity('product_category')
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  // Relations
  @ManyToMany(
    () => SupplierAttributes,
    (supplier) => supplier.productCategories,
  )
  suppliers: SupplierAttributes[];
}
