import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Label } from './entities/label.entity';
import { ProductCategory } from './entities/product-category.entity';
import { SupplierAttributes } from './entities/supplier-attributes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupplierAttributes, Label, ProductCategory]),
  ],
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports: [SuppliersService]
})
export class SuppliersModule {}
