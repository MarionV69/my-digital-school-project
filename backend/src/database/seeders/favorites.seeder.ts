import { DataSource } from 'typeorm';
import { Favorite } from '../../favorites/entities/favorite.entity';
import { Establishment } from '../../establishments/entities/establishment.entity';
import { favoritesData } from '../data/favorites.data';

export async function seedFavorites(dataSource: DataSource): Promise<void> {
  console.log('📌 Seeding favorites...');

  const favoriteRepo = dataSource.getRepository(Favorite);
  const establishmentRepo = dataSource.getRepository(Establishment);

  for (const favoriteData of favoritesData) {
    const owner = await establishmentRepo.findOne({
      where: { email: favoriteData.ownerEmail },
    });

    const target = await establishmentRepo.findOne({
      where: { email: favoriteData.targetEmail },
    });

    if (!owner || !target) {
      console.log('  ⚠️  Owner ou target introuvable');
      continue;
    }

    const existing = await favoriteRepo.findOne({
      where: {
        ownerId: owner.id,
        targetId: target.id,
      },
    });

    if (!existing) {
      await favoriteRepo.save({
        ownerId: owner.id,
        targetId: target.id,
      });

      console.log(
        `  ✅ Favorite créé: ${favoriteData.ownerEmail} → ${favoriteData.targetEmail}`,
      );
    } else {
      console.log(
        `  ℹ️  Favorite existe: ${favoriteData.ownerEmail} → ${favoriteData.targetEmail}`,
      );
    }
  }
}
