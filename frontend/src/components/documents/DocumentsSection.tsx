import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ImageIcon } from "lucide-react";
import { getDocuments } from "@/api/documents";
import {
  DocumentCategory,
  type GroupedDocuments,
} from "@/types/documents.types";
import { useAuth } from "@/hooks/useAuth";
import { EstablishmentType } from "@/types/establishments.types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Spinner } from "@/components/ui/spinner";
import DocumentCard from "./DocumentCard";
import DocumentUploadButton from "./DocumentUploadButton";

const IMAGE_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"];
const PDF_MIME_TYPES = ["application/pdf"];

function DocumentsSection() {
  const { user } = useAuth();
  const isSupplier = user?.establishmentType === EstablishmentType.SUPPLIER;

  const [documents, setDocuments] = useState<GroupedDocuments>({
    LOGO: [],
    COVER_PHOTO: [],
    CATALOG: [],
    GALLERY_PHOTO: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Erreur lors du chargement des documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="documents">
        <AccordionTrigger className="flex flex-row w-full gap-8 items-center">
          <div className="flex flex-row gap-2 items-center">
            <ImageIcon className="size-4 opacity-70" />
            <p>Médias &amp; documents</p>
          </div>
          <span className="bg-black/10 text-muted-foreground text-xs font-light px-2 py-1 rounded-full">
            Optionnel
          </span>
        </AccordionTrigger>

        <AccordionContent className="p-6 h-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner className="size-6 text-muted-foreground" />
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {/* Logo + Cover photo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                {/* Logo */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Logo</p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG/JPEG, WebP
                    </p>
                  </div>
                  {documents.LOGO[0] ? (
                    <div className="flex items-center justify-center h-36">
                      <DocumentCard
                        document={documents.LOGO[0]}
                        onDeleteSuccess={fetchDocuments}
                        imageFit="contain"
                      />
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input-border bg-muted/30 h-36 cursor-pointer hover:bg-muted/50 transition-colors">
                      <ImageIcon className="size-6 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Ajouter un logo
                      </p>
                      <input
                        type="file"
                        className="sr-only"
                        accept={IMAGE_MIME_TYPES.join(",")}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (!IMAGE_MIME_TYPES.includes(file.type)) {
                            toast.error("Format non autorisé.");
                            return;
                          }
                          if (file.size > 20 * 1024 * 1024) {
                            toast.error("Fichier trop volumineux (20 Mo max).");
                            return;
                          }
                          try {
                            const { uploadDocument } =
                              await import("@/api/documents");
                            await uploadDocument(file, DocumentCategory.LOGO);
                            toast.success("Logo ajouté !");
                            fetchDocuments();
                          } catch {
                            toast.error("Erreur lors de l'upload.");
                          }
                          e.target.value = "";
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* Cover photo */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Photo de couverture</p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG/JPEG, WebP
                    </p>
                  </div>
                  {documents.COVER_PHOTO[0] ? (
                    <DocumentCard
                      document={documents.COVER_PHOTO[0]}
                      onDeleteSuccess={fetchDocuments}
                    />
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input-border bg-muted/30 h-36 cursor-pointer hover:bg-muted/50 transition-colors">
                      <ImageIcon className="size-6 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Ajouter une photo de couverture
                      </p>
                      <input
                        type="file"
                        className="sr-only"
                        accept={IMAGE_MIME_TYPES.join(",")}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (!IMAGE_MIME_TYPES.includes(file.type)) {
                            toast.error("Format non autorisé.");
                            return;
                          }
                          if (file.size > 20 * 1024 * 1024) {
                            toast.error("Fichier trop volumineux (20 Mo max).");
                            return;
                          }
                          try {
                            const { uploadDocument } =
                              await import("@/api/documents");
                            await uploadDocument(
                              file,
                              DocumentCategory.COVER_PHOTO,
                            );
                            toast.success("Photo de couverture ajoutée !");
                            fetchDocuments();
                          } catch {
                            toast.error("Erreur lors de l'upload.");
                          }
                          e.target.value = "";
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Gallery — supplier only */}
              {isSupplier && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Galerie photos</p>
                    <p className="text-xs text-muted-foreground">
                      {documents.GALLERY_PHOTO.length}/6 · PNG, JPG/JPEG, WebP
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {documents.GALLERY_PHOTO.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        document={doc}
                        onDeleteSuccess={fetchDocuments}
                      />
                    ))}
                    {documents.GALLERY_PHOTO.length < 6 && (
                      <label className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-input-border bg-muted/30 h-36 cursor-pointer hover:bg-muted/50 transition-colors">
                        <span className="text-xl text-muted-foreground">+</span>
                        <p className="text-xs text-muted-foreground">Ajouter</p>
                        <input
                          type="file"
                          className="sr-only"
                          accept={IMAGE_MIME_TYPES.join(",")}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (!IMAGE_MIME_TYPES.includes(file.type)) {
                              toast.error("Format non autorisé.");
                              return;
                            }
                            if (file.size > 20 * 1024 * 1024) {
                              toast.error(
                                "Fichier trop volumineux (20 Mo max).",
                              );
                              return;
                            }
                            try {
                              const { uploadDocument } =
                                await import("@/api/documents");
                              await uploadDocument(
                                file,
                                DocumentCategory.GALLERY_PHOTO,
                              );
                              toast.success("Photo ajoutée !");
                              fetchDocuments();
                            } catch {
                              toast.error("Erreur lors de l'upload.");
                            }
                            e.target.value = "";
                          }}
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {documents.GALLERY_PHOTO.length} / 6 photos
                  </p>
                </div>
              )}

              {/* PDF documents — supplier only */}
              {isSupplier && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Autres documents</p>
                    <p className="text-xs text-muted-foreground">
                      4 fichiers max · PDF uniquement
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {documents.CATALOG.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        document={doc}
                        onDeleteSuccess={fetchDocuments}
                      />
                    ))}
                  </div>
                  {documents.CATALOG.length < 4 ? (
                    <DocumentUploadButton
                      category={DocumentCategory.CATALOG}
                      allowedMimeTypes={PDF_MIME_TYPES}
                      label="Ajouter un document PDF"
                      onUploadSuccess={fetchDocuments}
                    />
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      4 documents maximum. Supprimez un document pour en ajouter
                      un nouveau.
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {documents.CATALOG.length} / 4 documents
                  </p>
                </div>
              )}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default DocumentsSection;
