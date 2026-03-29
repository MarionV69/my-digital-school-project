import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Establishment } from '../../establishments/entities/establishment.entity';
import { EstablishmentType } from '../../establishments/enums/establishment-type.enum';
import { restaurantsData } from '../data/restaurants.data';
import { UserRole } from '../../users/enums/user-role.enum';

export async function seedRestaurants(
  dataSource: DataSource,
  hashedPassword: string,
): Promise<void> {
  console.log('📌 Seeding restaurants...');

  const userRepo = dataSource.getRepository(User);
  const establishmentRepo = dataSource.getRepository(Establishment);

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

      console.log(`  ✅ Restaurant créé: ${user.email}`);
    } else {
      console.log(`  ℹ️  Restaurant existe: ${user.email}`);
    }
  }
}
