import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getSupplierReviews } from "@/api/reviews";
import type { SupplierReviewsResponse } from "@/types/reviews.types";
import ReviewsSummary from "./ReviewsSummary";
import CreateReviewModal from "./CreateReviewModal";
import { Spinner } from "@/components/ui/spinner";
import { EstablishmentType } from "@/types/establishments.types";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

type ReviewsSectionProps = {
  supplierId: number;
};

export default function ReviewsSection({ supplierId }: ReviewsSectionProps) {
  const { user } = useAuth();
  const [reviewsData, setReviewsData] =
    useState<SupplierReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const isRestaurant = user?.establishmentType === EstablishmentType.RESTAURANT;
  const hasAlreadyReviewed = reviewsData?.reviews.some(
    (r) => r.reviewer.id === user?.establishmentId,
  );

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSupplierReviews(supplierId);
      setReviewsData(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        toast.error("Ce fournisseur n'existe pas.");
      } else {
        toast.error("Une erreur est survenue.");
      }
    } finally {
      setLoading(false);
    }
  }, [supplierId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = () => {
    fetchReviews();
  };

  const handleCreated = () => {
    fetchReviews();
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="reviews">
        <AccordionTrigger>
          Avis clients
          {reviewsData && reviewsData.count > 0
            ? ` (${reviewsData.count})`
            : ""}
        </AccordionTrigger>
        <AccordionContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="size-6 text-muted-foreground" />
            </div>
          ) : !reviewsData ? null : (
            <ReviewsSummary
              data={reviewsData}
              supplierId={supplierId}
              onDelete={handleDelete}
              action={
                isRestaurant && !hasAlreadyReviewed ? (
                  <CreateReviewModal
                    supplierId={supplierId}
                    onCreated={handleCreated}
                  />
                ) : undefined
              }
            />
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
