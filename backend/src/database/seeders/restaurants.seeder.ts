import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Establishment } from '../../establishments/entities/establishment.entity';
import { EstablishmentType } from '../../establishments/enums/establishment-type.enum';
import { restaurantsData } from '../data/restaurants.data';
import { UserRole } from '../../users/enums/user-role.enum';
import { StoredFile } from '../../files/entities/stored-file.entity';
import { Document } from '../../documents/entities/document.entity';
import { DocumentCategory } from '../../documents/enums/document.enum';

export async function seedRestaurants(
  dataSource: DataSource,
  hashedPassword: string,
): Promise<void> {
  console.log('📌 Seeding restaurants...');

  const userRepo = dataSource.getRepository(User);
  const establishmentRepo = dataSource.getRepository(Establishment);
  const fileRepo = dataSource.getRepository(StoredFile);
  const documentRepo = dataSource.getRepository(Document);

  for (const restaurantData of restaurantsData) {
    let user = await userRepo.findOne({
      where: { email: restaurantData.email },
    });

    if (!user) {
      // Créer User
      user = await userRepo.save({
        firstName: restaurantData.firstName,
        lastName: restaurantData.lastName,
        email: restaurantData.email,
        passwordHash: hashedPassword,
        role: UserRole.OWNER,
      });

      // Créer Establishment
      const establishment = await establishmentRepo.save({
        type: EstablishmentType.RESTAURANT,
        vatNumber: restaurantData.vatNumber,
        legalName: restaurantData.legalName,
        tradeName: restaurantData.tradeName,
        siret: restaurantData.siret,
        city: restaurantData.city,
        postalCode: restaurantData.postalCode,
        address: restaurantData.address,
        latitude: restaurantData.latitude,
        longitude: restaurantData.longitude,
        phone: restaurantData.phone,
        description: restaurantData.description,
        email: restaurantData.email,
        website: restaurantData.website,
        instagram: restaurantData.instagram,
      });

      // Lier user à l'établissement
      await userRepo.update(user.id, {
        establishmentId: establishment.id,
      });

      // Créer logo
      if (restaurantData.logoFile) {
        const logoFile = await fileRepo.save(restaurantData.logoFile);

        await documentRepo.save({
          establishmentId: establishment.id,
          fileId: logoFile.id,
          category: DocumentCategory.LOGO,
        });
      }

      // Créer cover
      if (restaurantData.coverFile) {
        const coverFile = await fileRepo.save(restaurantData.coverFile);

        await documentRepo.save({
          establishmentId: establishment.id,
          fileId: coverFile.id,
          category: DocumentCategory.COVER_PHOTO,
        });
      }

      console.log(`  ✅ Restaurant créé: ${user.email}`);
    } else {
      console.log(`  ℹ️  Restaurant existe: ${user.email}`);
    }
  }
}
