import { useState } from "react";
import RatingDistributionBar from "./RatingDistributionBar";
import ReviewCard from "./ReviewCard";
import type {
  ReviewResponse,
  SupplierReviewsResponse,
} from "@/types/reviews.types";

type ReviewsSummaryProps = {
  data: SupplierReviewsResponse;
  supplierId: number;
  onDelete?: (reviewId: number) => void;
  onReply?: (reviewId: number, reply: string) => void;
};

export default function ReviewsSummary({
  data,
  supplierId,
  onDelete,
  onReply,
}: ReviewsSummaryProps) {
  const [reviews, setReviews] = useState<ReviewResponse[]>(data.reviews);

  const distribution = reviews.reduce(
    (acc, r) => {
      acc[r.rating as 1 | 2 | 3 | 4 | 5]++;
      return acc;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>,
  );

  const handleDelete = (reviewId: number) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    onDelete?.(reviewId);
  };

  const handleReply = (reviewId: number, reply: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, reply } : r)),
    );
    onReply?.(reviewId, reply);
  };

  return (
    <div className="flex flex-col gap-4">
      <RatingDistributionBar
        average={data.average}
        count={data.count}
        distribution={distribution}
      />

      <div className="flex flex-col">
        {reviews.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            Aucun avis pour le moment.
          </p>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              supplierId={supplierId}
              onDelete={onDelete ? handleDelete : undefined}
              onReply={onReply ? handleReply : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
}
