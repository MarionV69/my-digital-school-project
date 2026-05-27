import { useState, type ChangeEvent } from "react";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";
import { uploadDocument } from "@/api/documents";
import { DocumentCategory } from "@/types/documents.types";
import { Button } from "@/components/ui/button";

type DocumentUploadButtonProps = {
  category: DocumentCategory;
  allowedMimeTypes: string[];
  label: string;
  onUploadSuccess: () => void;
  disabled?: boolean;
};

function DocumentUploadButton({
  category,
  allowedMimeTypes,
  label,
  onUploadSuccess,
  disabled = false,
}: DocumentUploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (20MB max)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Le fichier est trop volumineux (20 Mo max).");
      e.target.value = "";
      return;
    }

    // Validate file type
    if (!allowedMimeTypes.includes(file.type)) {
      const formats = allowedMimeTypes.map((type) =>
        type.split("/")[1].toUpperCase(),
      );
      const formatsText =
        formats.length > 1
          ? `${formats.slice(0, -1).join(", ")} et ${formats.slice(-1)}`
          : formats[0];
      toast.error(`Format non autorisé. Formats acceptés : ${formatsText}`);
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    try {
      await uploadDocument(file, category);
      toast.success("Fichier ajouté avec succès !");
      onUploadSuccess();
      e.target.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erreur lors du téléchargement.");
      e.target.value = "";
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <label className="cursor-pointer">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isUploading || disabled}
        asChild
      >
        <span>
          <Upload className="size-4" />
          {isUploading ? "Téléchargement..." : label}
        </span>
      </Button>
      <input
        type="file"
        onChange={handleFileChange}
        disabled={isUploading || disabled}
        className="sr-only"
        accept={allowedMimeTypes.join(",")}
      />
    </label>
  );
}

export default DocumentUploadButton;
