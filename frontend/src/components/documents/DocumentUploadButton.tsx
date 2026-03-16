import { useState, type ChangeEvent } from "react";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";
import { uploadDocument } from "../../api/documents";
import { DocumentCategory } from "../../types/documents.types";

type DocumentUploadButtonProps = {
  category: DocumentCategory;
  accept: string; // "image/png, image/jpeg, image/webp" ou "application/pdf"
  label: string;
  onUploadSuccess: () => void;
};

function DocumentUploadButton({
  category,
  accept,
  label,
  onUploadSuccess,
}: DocumentUploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Fichier trop volumineux. Taille maximale : 10 Mo");
      e.target.value = ""; // Reset input
      return;
    }

    setIsUploading(true);
    try {
      await uploadDocument(file, category);
      toast.success("Document téléchargé avec succès !");
      onUploadSuccess();
      e.target.value = ""; // Reset input
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erreur lors du téléchargement");
      e.target.value = ""; // Reset input
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <label className="btn inline-flex items-center gap-2 cursor-pointer">
      <Upload className="w-4 h-4" />
      <span>{isUploading ? "Téléchargement en cours..." : label}</span>
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={isUploading}
        className="sr-only"
      />
    </label>
  );
}

export default DocumentUploadButton;
