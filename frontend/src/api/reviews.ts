import type {
  CreateReviewDto,
  ReplyReviewDto,
  ReviewResponse,
  SupplierReviewsResponse,
} from "@/types/reviews.types";
import { api } from "./axiosConfig";

export const createReview = async (
  dto: CreateReviewDto,
): Promise<ReviewResponse> => {
  const response = await api.post<ReviewResponse>("/reviews", dto);
  return response.data;
};

export const getSupplierReviews = async (
  supplierId: number,
): Promise<SupplierReviewsResponse> => {
  const response = await api.get<SupplierReviewsResponse>("/reviews", {
    params: { supplierId },
  });
  return response.data;
};

export const replyToReview = async (
  reviewId: number,
  dto: ReplyReviewDto,
): Promise<ReviewResponse> => {
  const response = await api.patch<ReviewResponse>(
    `/reviews/${reviewId}/reply`,
    dto,
  );
  return response.data;
};

export const deleteReview = async (reviewId: number): Promise<void> => {
  await api.delete(`/reviews/${reviewId}`);
};
