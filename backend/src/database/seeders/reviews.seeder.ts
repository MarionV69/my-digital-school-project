import { DataSource } from 'typeorm';
import { Review } from '../../reviews/entities/review.entity';
import { Establishment } from '../../establishments/entities/establishment.entity';
import { reviewsData } from '../data/reviews.data';

export async function seedReviews(dataSource: DataSource): Promise<void> {
  console.log('📌 Seeding reviews...');

  const reviewRepo = dataSource.getRepository(Review);
  const establishmentRepo = dataSource.getRepository(Establishment);

  for (const reviewData of reviewsData) {
    const restaurant = await establishmentRepo.findOne({
      where: { email: reviewData.restaurantEmail },
    });

    const supplier = await establishmentRepo.findOne({
      where: { email: reviewData.supplierEmail },
    });

    if (!restaurant || !supplier) {
      console.log('  ⚠️ Restaurant ou supplier introuvable');
      continue;
    }

    const existing = await reviewRepo.findOne({
      where: {
        reviewerRestaurantId: restaurant.id,
        reviewedSupplierId: supplier.id,
        comment: reviewData.comment,
      },
    });

    if (!existing) {
      await reviewRepo.save({
        reviewerRestaurantId: restaurant.id,
        reviewedSupplierId: supplier.id,
        rating: reviewData.rating,
        comment: reviewData.comment,
        createdAt: reviewData.createdAt,
        reply: reviewData.reply,
        repliedAt: reviewData.repliedAt,
      });

      console.log(
        `  ✅ Review créée: ${reviewData.restaurantEmail} → ${reviewData.supplierEmail}`,
      );
    }
  }
}
