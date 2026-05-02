export type CreateReviewDto = {
  supplierId: number;
  rating: number;
  comment: string;
};

export type ReviewResponse = {
  id: number;
  rating: number;
  comment: string;
  reply: string | null;
  repliedAt: Date | null;
  createdAt: Date;
  reviewer: {
    id: number;
    name: string;
  };
};

export type SupplierReviewsResponse = {
  average: number;
  count: number;
  reviews: ReviewResponse[];
};

export type ReplyReviewDto = {
  reply: string;
};
