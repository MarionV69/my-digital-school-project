import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { Label } from './entities/label.entity';
import { ProductCategory } from './entities/product-category.entity';
import { SupplierDocument } from './entities/supplier-document.entity';
import { FilesModule } from '../files/files.module';
import { SupplierDocumentsService } from './supplier-document.service';
import { SupplierDocumentsController } from './supplier-document-controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Supplier,
      Label,
      ProductCategory,
      SupplierDocument,
    ]),
    FilesModule,
  ],
  controllers: [SuppliersController, SupplierDocumentsController],
  providers: [SuppliersService, SupplierDocumentsService],
})
export class SuppliersModule {}
