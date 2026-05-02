import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StarRating from "./StarRating";
import { replyToReview, deleteReview } from "@/api/reviews";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { EstablishmentType } from "@/types/establishments.types";
import type { ReviewResponse } from "@/types/reviews.types";
import axios from "axios";

type ReviewCardProps = {
  review: ReviewResponse;
  supplierId: number;
  onDelete?: (reviewId: number) => void;
  onReply?: (reviewId: number, reply: string) => void;
};

export default function ReviewCard({
  review,
  supplierId,
  onDelete,
  onReply,
}: ReviewCardProps) {
  const { user } = useAuth();
  const [replyContent, setReplyContent] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isAuthor =
    user?.establishmentType === EstablishmentType.RESTAURANT &&
    review.reviewer.id === user.establishmentId;

  const isReviewedSupplier =
    user?.establishmentType === EstablishmentType.SUPPLIER &&
    user.establishmentId === supplierId;

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });

  const handleDelete = async () => {
    try {
      await deleteReview(review.id);
      toast.success("Avis supprimé");
      onDelete?.(review.id);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        toast.error("Cet avis n'existe plus.");
      } else {
        toast.error("Une erreur est survenue.");
      }
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    setSubmitting(true);
    try {
      await replyToReview(review.id, { reply: replyContent });
      toast.success("Réponse publiée");
      onReply?.(review.id, replyContent);
      setShowReplyForm(false);
      setReplyContent("");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error("Vous avez déjà répondu à cet avis.");
      } else {
        toast.error("Une erreur est survenue.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 py-4 border-b border-border last:border-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-foreground">
            {review.reviewer.name}
          </span>
          <StarRating value={review.rating} size="sm" />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground">
            {formatDate(review.createdAt)}
          </span>
          {isAuthor && onDelete && (
            <button
              onClick={handleDelete}
              className="cursor-pointer text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Supprimer l'avis"
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Commentaire */}
      <p className="text-sm text-foreground">{review.comment}</p>

      {/* Reply existante */}
      {review.reply && (
        <div className="ml-4 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground border-l-2 border-primary">
          <span className="font-medium text-foreground">
            Réponse du fournisseur ·{" "}
          </span>
          {review.reply}
        </div>
      )}

      {/* Bouton répondre — supplier concerné, pas encore de reply */}
      {isReviewedSupplier && !review.reply && onReply && (
        <>
          {!showReplyForm ? (
            <button
              onClick={() => setShowReplyForm(true)}
              className="self-start text-xs text-primary-mid hover:underline cursor-pointer"
            >
              Répondre
            </button>
          ) : (
            <div className="flex flex-col gap-2 ml-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Votre réponse..."
                rows={3}
                className="w-full rounded-lg bg-muted px-3 py-2 text-sm outline-none resize-none placeholder:text-muted-foreground"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleReply}
                  disabled={submitting || !replyContent.trim()}
                >
                  {submitting ? "Envoi..." : "Publier"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent("");
                  }}
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
