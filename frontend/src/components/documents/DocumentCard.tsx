import { ExternalLink, X } from "lucide-react";
import { deleteDocument } from "@/api/documents";
import type { DocumentItem } from "@/types/documents.types";
import toast from "react-hot-toast";
import { useState } from "react";
import ImageWithLoader from "@/components/common/ImageWithLoader";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

type DocumentCardProps = {
  document: DocumentItem;
  onDeleteSuccess: () => void;
  imageFit?: "cover" | "contain";
};

function DocumentCard({
  document,
  onDeleteSuccess,
  imageFit = "cover",
}: DocumentCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDocument(document.id);
      toast.success("Document supprimé.");
      onDeleteSuccess();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Erreur lors de la suppression.");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  // Image card
  if (document.file.mimeType.startsWith("image/")) {
    return (
      <div className="relative rounded-lg overflow-hidden">
        <ImageWithLoader
          src={document.file.url}
          alt={document.file.originalFilename}
          className={"w-full h-36"}
          objectFit={imageFit}
        />
        {/* Delete button */}
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="absolute top-1.5 right-1.5 flex items-center justify-center size-6 rounded-full bg-background/80 hover:bg-background text-foreground transition-colors cursor-pointer"
            aria-label="Supprimer"
          >
            <X className="size-3.5" />
          </button>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 rounded-lg">
            <p className="text-sm font-medium">Supprimer ?</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                Oui
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
              >
                Non
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // PDF card
  return (
    <div className="flex items-center gap-3 rounded-lg border border-input-border bg-background px-3 py-2.5">
      <FileText className="size-4 shrink-0 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {document.file.originalFilename}
        </p>
        <p className="text-xs text-muted-foreground">
          PDF · {(document.file.size / (1024 * 1024)).toFixed(1)} Mo
        </p>
      </div>
      <a
        href={document.file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-muted-foreground hover:text-foreground"
        aria-label="Ouvrir"
      >
        <ExternalLink className="size-4" />
      </a>
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="shrink-0 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
          aria-label="Supprimer"
        >
          <X className="size-4" />
        </button>
      ) : (
        <div className="flex gap-2 shrink-0 align-bottom">
          <p className="text-sm">Supprimer ?</p>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            Oui
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
          >
            Non
          </Button>
        </div>
      )}
    </div>
  );
}

export default DocumentCard;
