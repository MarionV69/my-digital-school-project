import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Establishment } from '../../establishments/entities/establishment.entity';
import { EstablishmentType } from '../../establishments/enums/establishment-type.enum';
import { SupplierAttributes } from '../../suppliers/entities/supplier-attributes.entity';
import { StoredFile } from '../../files/entities/stored-file.entity';
import { Document } from '../../documents/entities/document.entity';
import { DocumentCategory } from '../../documents/enums/document.enum';
import { Label } from '../../suppliers/entities/label.entity';
import { ProductCategory } from '../../suppliers/entities/product-category.entity';
import { suppliersData } from '../data/suppliers.data';
import { UserRole } from '../../users/enums/user-role.enum';

export async function seedSuppliers(
  dataSource: DataSource,
  hashedPassword: string,
  labels: Label[],
  categories: ProductCategory[],
): Promise<void> {
  console.log('📌 Seeding suppliers...');

  const userRepo = dataSource.getRepository(User);
  const establishmentRepo = dataSource.getRepository(Establishment);
  const supplierRepo = dataSource.getRepository(SupplierAttributes);
  const fileRepo = dataSource.getRepository(StoredFile);
  const documentRepo = dataSource.getRepository(Document);

  for (const supplierData of suppliersData) {
    let user = await userRepo.findOne({
      where: { email: supplierData.email },
    });

    if (!user) {
      // Créer User
      user = await userRepo.save({
        firstName: supplierData.firstName,
        lastName: supplierData.lastName,
        email: supplierData.email,
        passwordHash: hashedPassword,
        role: UserRole.OWNER,
      });

      // Créer Establishment
      const establishment = await establishmentRepo.save({
        type: EstablishmentType.SUPPLIER,
        vatNumber: supplierData.vatNumber,
        legalName: supplierData.legalName,
        tradeName: supplierData.tradeName,
        siret: supplierData.siret,
        city: supplierData.city,
        postalCode: supplierData.postalCode,
        address: supplierData.address,
        latitude: supplierData.latitude,
        longitude: supplierData.longitude,
        phone: supplierData.phone,
        description: supplierData.description,
        email: supplierData.email,
        website: supplierData.website,
        instagram: supplierData.instagram,
        facebook: supplierData.facebook,
      });

      // Lier user à l'établissement
      await userRepo.update(user.id, {
        establishmentId: establishment.id,
      });

      // Trouver labels
      const supplierLabels = labels.filter((label) =>
        supplierData.labels.includes(label.name),
      );

      // Trouver categories
      const supplierCategories = categories.filter((category) =>
        supplierData.categories.includes(category.name),
      );

      // Créer SupplierAttributes
      await supplierRepo.save({
        supplierId: establishment.id,
        supplierType: supplierData.supplierType,
        priceRange: supplierData.priceRange,
        deliveryRadiusKm: supplierData.deliveryRadiusKm,
        deliveryInformation: supplierData.deliveryInformation,
        minimumOrderAmount: supplierData.minimumOrderAmount,
        isPremium: supplierData.isPremium,
        isVisible: supplierData.isVisible,
        labels: supplierLabels,
        productCategories: supplierCategories,
      });

      // Créer logo
      if (supplierData.logoFile) {
        const logoFile = await fileRepo.save({
          originalFilename: supplierData.logoFile.originalFilename,
          path: supplierData.logoFile.path,
          mimeType: supplierData.logoFile.mimeType,
          size: supplierData.logoFile.size,
        });

        await documentRepo.save({
          establishmentId: establishment.id,
          fileId: logoFile.id,
          category: DocumentCategory.LOGO,
        });
      }

      // Créer cover
      if (supplierData.coverFile) {
        const coverFile = await fileRepo.save({
          originalFilename: supplierData.coverFile.originalFilename,
          path: supplierData.coverFile.path,
          mimeType: supplierData.coverFile.mimeType,
          size: supplierData.coverFile.size,
        });

        await documentRepo.save({
          establishmentId: establishment.id,
          fileId: coverFile.id,
          category: DocumentCategory.COVER_PHOTO,
        });
      }

      // Créer catalogues
      if (supplierData.catalogFiles && supplierData.catalogFiles.length > 0) {
        for (const catalogFileData of supplierData.catalogFiles) {
          const catalogFile = await fileRepo.save(catalogFileData);

          await documentRepo.save({
            establishmentId: establishment.id,
            fileId: catalogFile.id,
            category: DocumentCategory.CATALOG,
          });
        }
      }

      // Créer gallery photos
      if (supplierData.galleryFiles && supplierData.galleryFiles.length > 0) {
        for (const galleryFileData of supplierData.galleryFiles) {
          const galleryFile = await fileRepo.save(galleryFileData);

          await documentRepo.save({
            establishmentId: establishment.id,
            fileId: galleryFile.id,
            category: DocumentCategory.GALLERY_PHOTO,
          });
        }
      }

      console.log(`  ✅ Supplier créé: ${user.email}`);
    } else {
      console.log(`  ℹ️  Supplier existe: ${user.email}`);
    }
  }
}
