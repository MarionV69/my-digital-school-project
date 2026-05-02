import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { Establishment } from '../establishments/entities/establishment.entity';
import { EstablishmentType } from '../establishments/enums/establishment-type.enum';
import { ReviewResponseDto } from './dto/review-response.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';
import { SupplierReviewsResponseDto } from './dto/supplier-reviews-response.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewsRepository: Repository<Review>,
    @InjectRepository(Establishment)
    private establishmentsRepository: Repository<Establishment>,
  ) {}

  // Only restaurants can create a review, one review per supplier
  async createReview(
    establishmentId: number,
    establishmentType: EstablishmentType,
    dto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    if (establishmentType !== EstablishmentType.RESTAURANT) {
      throw new ForbiddenException('Only restaurants can create reviews');
    }

    const supplier = await this.establishmentsRepository.findOne({
      where: {
        id: dto.supplierId,
        type: EstablishmentType.SUPPLIER,
      },
    });

    if (!supplier) throw new NotFoundException('Supplier not found');

    const existingReview = await this.reviewsRepository.findOne({
      where: {
        reviewerRestaurantId: establishmentId,
        reviewedSupplierId: dto.supplierId,
      },
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this supplier');
    }

    const review = this.reviewsRepository.create({
      reviewerRestaurantId: establishmentId,
      reviewedSupplierId: dto.supplierId,
      rating: dto.rating,
      comment: dto.comment,
    });
    const saved = await this.reviewsRepository.save(review);

    const restaurant = await this.establishmentsRepository.findOne({
      where: { id: establishmentId },
    });

    return this.toResponseDto(saved, restaurant!);
  }

  async getSupplierReviews(
    supplierId: number,
  ): Promise<SupplierReviewsResponseDto> {
    const reviews = await this.reviewsRepository.find({
      where: { reviewedSupplierId: supplierId },
      relations: ['reviewer'],
      order: { createdAt: 'DESC' },
    });

    const count = reviews.length;
    const average =
      count > 0
        ? Math.round(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10,
          ) / 10
        : 0;

    return {
      average,
      count,
      reviews: reviews.map((review) =>
        this.toResponseDto(review, review.reviewer),
      ),
    };
  }

  // Only the reviewed supplier can reply, one reply per review
  async replyToReview(
    reviewId: number,
    establishmentId: number,
    establishmentType: EstablishmentType,
    dto: ReplyReviewDto,
  ): Promise<ReviewResponseDto> {
    if (establishmentType !== EstablishmentType.SUPPLIER) {
      throw new ForbiddenException('Only suppliers can reply to reviews');
    }

    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId },
      relations: ['reviewer'],
    });

    if (!review) throw new NotFoundException('Review not found');

    if (review.reviewedSupplierId !== establishmentId) {
      throw new ForbiddenException(
        'This review is not about your establishment',
      );
    }

    review.reply = dto.reply;
    review.repliedAt = new Date();
    const saved = await this.reviewsRepository.save(review);

    return this.toResponseDto(saved, review.reviewer);
  }

  // Only the restaurant author can delete his own review
  async deleteReview(
    reviewId: number,
    establishmentId: number,
    establishmentType: EstablishmentType,
  ): Promise<void> {
    if (establishmentType !== EstablishmentType.RESTAURANT) {
      throw new ForbiddenException('Only restaurants can delete reviews');
    }
    const review = await this.reviewsRepository.findOneBy({ id: reviewId });
    if (!review) throw new NotFoundException('Review not found');
    if (review.reviewerRestaurantId !== establishmentId) {
      throw new ForbiddenException('You are not the author of this review');
    }

    await this.reviewsRepository.remove(review);
  }

  // Maps a Review entity to ReviewResponseDto
  private toResponseDto(
    review: Review,
    reviewer: Establishment,
  ): ReviewResponseDto {
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      reply: review.reply,
      repliedAt: review.repliedAt,
      createdAt: review.createdAt,
      reviewer: {
        id: reviewer.id,
        name: reviewer.tradeName ?? reviewer.legalName,
      },
    };
  }
}
