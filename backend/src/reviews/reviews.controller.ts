import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { EstablishmentGuard } from '../common/guards/establishment.guard';
import { ReviewResponseDto } from './dto/review-response.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';
import { SupplierReviewsResponseDto } from './dto/supplier-reviews-response.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentEstablishmentUser } from 'src/common/decorators/current-establishment-user.decorator';
import { type UserWithEstablishment } from 'src/common/types/user-with-establishment.type';

@ApiTags('reviews')
@ApiBearerAuth()
@UseGuards(EstablishmentGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a review for a supplier' })
  @ApiCreatedResponse({ type: ReviewResponseDto })
  @ApiForbiddenResponse({ description: 'Only restaurants can create reviews' })
  @ApiNotFoundResponse({ description: 'Supplier not found' })
  @ApiConflictResponse({
    description: 'You have already reviewed this supplier',
  })
  createReview(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentEstablishmentUser() user: UserWithEstablishment,
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.createReview(
      user.establishmentId,
      user.establishmentType,
      createReviewDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews for a supplier' })
  @ApiOkResponse({ type: SupplierReviewsResponseDto })
  @ApiQuery({ name: 'supplierId', type: Number, required: true })
  @Public()
  getSupplierReviews(
    @Query('supplierId', ParseIntPipe) supplierId: number,
  ): Promise<SupplierReviewsResponseDto> {
    return this.reviewsService.getSupplierReviews(supplierId);
  }

  @Patch(':id/reply')
  @ApiOperation({ summary: 'Reply to a review' })
  @ApiOkResponse({ type: ReviewResponseDto })
  @ApiForbiddenResponse({ description: 'Only suppliers can reply to reviews' })
  @ApiNotFoundResponse({ description: 'Review not found' })
  @ApiConflictResponse({
    description: 'You have already replied to this review',
  })
  replyToReview(
    @Param('id', ParseIntPipe) reviewId: number,
    @Body() replyReviewDto: ReplyReviewDto,
    @CurrentEstablishmentUser() user: UserWithEstablishment,
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.replyToReview(
      reviewId,
      user.establishmentId,
      user.establishmentType,
      replyReviewDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a review' })
  @ApiNoContentResponse({ description: 'Review deleted successfully' })
  @ApiForbiddenResponse({ description: 'Only restaurants can delete reviews' })
  @ApiNotFoundResponse({ description: 'Review not found' })
  deleteReview(
    @Param('id', ParseIntPipe) reviewId: number,
    @CurrentEstablishmentUser() user: UserWithEstablishment,
  ): Promise<void> {
    return this.reviewsService.deleteReview(
      reviewId,
      user.establishmentId,
      user.establishmentType,
    );
  }
}
