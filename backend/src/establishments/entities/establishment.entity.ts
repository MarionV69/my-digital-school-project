import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SupplierAttributes } from '../../suppliers/entities/supplier-attributes.entity';
import { EstablishmentType } from '../enums/establishment-type.enum';

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

  // Relations
  @OneToOne(
    () => SupplierAttributes,
    (supplierAttributes) => supplierAttributes.supplier,
    {
      cascade: true,
      nullable: true,
    },
  )
  supplierAttributes: SupplierAttributes | null;
}
