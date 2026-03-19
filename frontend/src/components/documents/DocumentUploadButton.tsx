import { useState, type ChangeEvent } from "react";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";
import { uploadDocument } from "../../api/documents";
import { DocumentCategory } from "../../types/documents.types";

type DocumentUploadButtonProps = {
  category: DocumentCategory;
  allowedMimeTypes: string[]; // ["image/png", "image/jpeg", "image/webp"] ou ["application/pdf"]
  label: string;
  onUploadSuccess: () => void;
};

function DocumentUploadButton({
  category,
  allowedMimeTypes,
  label,
  onUploadSuccess,
}: DocumentUploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [helperText, setHelperText] = useState<string | null>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHelperText(null); // Reset helper text

    // Validate file size (20MB max)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Le fichier est trop volumineux.");
      setHelperText("Taille maximale : 20 Mo");
      e.target.value = ""; // Reset input
      return;
    }

    // Validate file type
    if (!allowedMimeTypes.includes(file.type)) {
      toast.error("Type de fichier non autorisé.");
      const formats = allowedMimeTypes.map((type) =>
        type.split("/")[1].toUpperCase(),
      );
      const formatsText =
        formats.length > 1
          ? `${formats.slice(0, -1).join(", ")} et ${formats.slice(-1)}`
          : formats[0];
      setHelperText(`Seuls les fichiers ${formatsText} sont acceptés.`);
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
    <div>
      <label className="btn">
        <Upload className="w-4 h-4" />
        <span>{isUploading ? "Téléchargement en cours..." : label}</span>
        <input
          type="file"
          onChange={handleFileChange}
          disabled={isUploading}
          className="sr-only"
        />
      </label>
      {helperText && <p className="mt-2 text-sm text-accent">{helperText}</p>}
    </div>
  );
}

export default DocumentUploadButton;
