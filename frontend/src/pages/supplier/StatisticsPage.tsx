import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getSupplierReviews } from "@/api/reviews";
import { getSupplierStats } from "@/api/suppliers";
import type { SupplierReviewsResponse } from "@/types/reviews.types";
import type { SupplierStatsDto } from "@/types/suppliers.types";
import ReviewsSummary from "@/components/reviews/ReviewsSummary";
import { Spinner } from "@/components/ui/spinner";
import { Heart, MessageSquare, Star } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function StatisticsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<SupplierStatsDto | null>(null);
  const [reviewsData, setReviewsData] =
    useState<SupplierReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.establishmentId === null) return;

      try {
        const [statsData, reviews] = await Promise.all([
          getSupplierStats(user.establishmentId as number),
          getSupplierReviews(user.establishmentId as number),
        ]);
        setStats(statsData);
        setReviewsData(reviews);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          toast.error("Fournisseur introuvable.");
        } else {
          toast.error("Une erreur est survenue.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleReply = (reviewId: number, reply: string) => {
    setReviewsData((prev) =>
      prev
        ? {
            ...prev,
            reviews: prev.reviews.map((r) =>
              r.id === reviewId ? { ...r, reply } : r,
            ),
          }
        : prev,
    );
  };

  if (!user || user.establishmentId === null) return null;

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-73px)] items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-8 py-8 lg:py-12 flex flex-col gap-8 max-w-7xl mx-auto w-full">
      <h3>Mes statistiques</h3>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1 rounded-lg bg-muted p-6">
            <Heart className="size-5 text-primary-mid fill-primary-mid" />
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              Mis en favoris
            </span>
            <span className="text-4xl font-semibold text-foreground">
              {stats.favoriteCount}
            </span>
          </div>

          <div className="flex flex-col gap-1 rounded-lg bg-muted p-6">
            <Star className="size-5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              Note moyenne
            </span>
            {stats.averageRating > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-4xl font-semibold text-foreground">
                  {Math.round(stats.averageRating * 10) / 10}
                </span>
                <span className="text-lg font-semibold text-muted-foreground/80">
                  /5
                </span>
              </div>
            ) : (
              <span className="text-4xl font-semibold text-foreground">—</span>
            )}
          </div>

          <div className="flex flex-col gap-1 rounded-lg bg-muted p-6">
            <MessageSquare className="size-5 text-muted-foreground/80 fill-muted-foreground/80" />
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              Avis reçus
            </span>
            <span className="text-4xl font-semibold text-foreground">
              {stats.reviewCount}
            </span>
          </div>
        </div>
      )}

      {/* Reviews */}
      {reviewsData && (
        <div className="flex flex-col gap-4">
          <h3 className="">Distribution des notes</h3>
          <ReviewsSummary
            data={reviewsData}
            supplierId={user.establishmentId as number}
            reviewsTitle="Avis"
            onReply={handleReply}
          />
        </div>
      )}
    </div>
  );
}
