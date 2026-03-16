//
import { ExternalLink, Trash2 } from "lucide-react";
import { deleteDocument } from "../../api/documents";
import type { DocumentItem } from "../../types/documents.types";
import toast from "react-hot-toast";
import { useState } from "react";

type DocumentPreviewAndDeleteProps = {
  document: DocumentItem;
  onDeleteSuccess: () => void;
};

function DocumentPreviewAndDelete({
  document,
  onDeleteSuccess,
}: DocumentPreviewAndDeleteProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleTrashClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    try {
      await deleteDocument(document.id);
      toast.success("Document supprimé");
      onDeleteSuccess();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Erreur lors de la suppression du document");
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  // Image
  if (document.file.mimeType.startsWith("image/")) {
    return (
      <div className="relative rounded-lg shadow-md shadow-brand-dark/60 overflow-hidden">
        <img
          src={document.file.url}
          alt={document.file.originalFilename}
          className="w-full h-auto sm:h-40 sm:w-auto object-cover"
        />
        <div className="absolute top-2 right-2">
          {!showConfirm ? (
            <button
              onClick={handleTrashClick}
              className="btn rounded-full p-1.5 border-2 border-cream"
              aria-label="Supprimer le document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex flex-col gap-2 bg-white p-3 rounded-lg shadow-lg border border-gray-200">
              <p className="text-sm font-medium text-brand-light whitespace-nowrap">
                Supprimer ?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleConfirmDelete}
                  className="btn text-sm px-3 py-1.5"
                >
                  Oui
                </button>
                <button
                  onClick={handleCancel}
                  className="btn btn-ghost text-brand-light text-sm px-3 py-1.5"
                >
                  Non
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // PDF
  return (
    <div className="relative">
      <div className="bg-white flex items-center gap-3 p-3 shadow-md shadow-brand-dark/60 rounded-lg">
        <a
          href={document.file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1  text-brand-light font-medium truncate hover:underline"
        >
          {document.file.originalFilename}
          <ExternalLink className="inline ml-2 w-7 h-7 p-1 transition hover:-translate-y-0.5" />
        </a>

        <button
          onClick={handleTrashClick}
          className="btn rounded-full p-1.5"
          aria-label="Supprimer le document"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      {showConfirm && (
        <div className="absolute top-full w-full left-0 mt-2 z-10 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md shadow-brand-dark/60 whitespace-nowrap">
          <span className="text-sm font-medium text-brand-light mr-4">
            Supprimer ?
          </span>
          <button onClick={handleConfirmDelete} className="btn text-sm py-1.5">
            Oui
          </button>
          <button
            onClick={handleCancel}
            className="btn btn-ghost text-brand-light text-sm"
          >
            Non
          </button>
        </div>
      )}
    </div>
  );
}

export default DocumentPreviewAndDelete;
