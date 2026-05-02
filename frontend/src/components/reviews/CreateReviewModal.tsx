import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StarRating from "./StarRating";
import { createReview } from "@/api/reviews";
import { Spinner } from "../ui/spinner";

type CreateReviewModalProps = {
  supplierId: number;
  onCreated: () => void;
};

export default function CreateReviewModal({
  supplierId,
  onCreated,
}: CreateReviewModalProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Veuillez sélectionner une note.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Veuillez écrire un commentaire.");
      return;
    }

    setSubmitting(true);
    try {
      await createReview({ supplierId, rating, comment });
      toast.success("Avis publié !");
      onCreated();
      setOpen(false);
      setRating(0);
      setComment("");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error("Vous avez déjà laissé un avis pour ce fournisseur.");
        setOpen(false);
      } else {
        toast.error("Une erreur est survenue.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setRating(0);
      setComment("");
    }
    setOpen(value);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Pencil className="size-4" />
        Laisser un avis
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md border border-primary-mid">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary-mid font-semibold">
              Laisser un avis
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            {/* Star picker */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">
                Note *
              </span>
              <StarRating
                interactive
                value={rating}
                onChange={setRating}
                size="lg"
              />
            </div>

            {/* Comment */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">
                Commentaire *
              </span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez votre expérience avec ce fournisseur..."
                rows={4}
                maxLength={2000}
                className="w-full rounded-lg bg-muted px-3 py-2 text-sm outline-none resize-none placeholder:text-muted-foreground"
              />
              <span className="self-end text-xs text-muted-foreground">
                {comment.length}/2000
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => handleOpenChange(false)}
                disabled={submitting}
              >
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? <Spinner className="size-4" /> : "Publier"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
