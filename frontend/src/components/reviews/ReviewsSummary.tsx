import RatingDistributionBar from "./RatingDistributionBar";
import ReviewCard from "./ReviewCard";
import type { SupplierReviewsResponse } from "@/types/reviews.types";

type ReviewsSummaryProps = {
  data: SupplierReviewsResponse;
  supplierId: number;
  reviewsTitle?: string;
  action?: React.ReactNode;
  onDelete?: () => void;
  onReply?: (reviewId: number, reply: string) => void;
};

export default function ReviewsSummary({
  data,
  supplierId,
  reviewsTitle,
  action,
  onDelete,
  onReply,
}: ReviewsSummaryProps) {
  const distribution = data.reviews.reduce(
    (acc, r) => {
      acc[r.rating as 1 | 2 | 3 | 4 | 5]++;
      return acc;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>,
  );

  return (
    <div className="flex flex-col gap-4">
      <RatingDistributionBar
        average={data.average}
        count={data.count}
        distribution={distribution}
      />

      {/* Reviews list header */}
      {(reviewsTitle || action) && (
        <div className="flex items-center justify-between my-2">
          {reviewsTitle && <h3>{reviewsTitle}</h3>}
          {action && action}
        </div>
      )}

      {/* Reviews list */}
      <div className="flex flex-col gap-3">
        {data.reviews.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            Aucun avis pour le moment.
          </p>
        ) : (
          data.reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              supplierId={supplierId}
              onDelete={onDelete}
              onReply={onReply}
            />
          ))
        )}
      </div>
    </div>
  );
}
