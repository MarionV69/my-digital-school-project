import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { type GroupedDocuments } from "../../types/documents.types";
import { getDocuments } from "../../api/documents";
import { useAuth } from "../../hooks/useAuth";
import { EstablishmentType } from "../../types/establishments.types";
import DocumentCard from "./DocumentCard";
import DocumentUploadButton from "./DocumentUploadButton";

function DocumentsList() {
  const { user } = useAuth();
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
      toast.error("Erreur lors du chargement des documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <section className="bg-[#fdf4ef] border-2 border-brand-dark max-w-6xl mx-auto my-6 p-6 rounded-lg text-brand-dark">
      <h2 className="text-3xl font-bold mb-10 text-center">
        Vos documents publiques
      </h2>

      <div className="space-y-10">
        <div className="flex gap-8 justify-center flex-wrap">
          {/* LOGO */}
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-semibold mb-4">Logo</h3>
            {documents.LOGO[0] ? (
              <div className="space-y-3 flex flex-col items-center">
                <DocumentCard
                  document={documents.LOGO[0]}
                  onDeleteSuccess={fetchDocuments}
                />
                <p className="text-sm italic text-center">
                  Supprimez le logo pour en télécharger un nouveau.
                </p>
              </div>
            ) : (
              <DocumentUploadButton
                category="LOGO"
                allowedMimeTypes={["image/png", "image/jpeg", "image/webp"]}
                label="Ajouter votre logo"
                onUploadSuccess={fetchDocuments}
              />
            )}
          </div>

          {/* COVER PHOTO */}
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-semibold mb-4">Photo de couverture</h3>
            {documents.COVER_PHOTO[0] ? (
              <div className="space-y-3 flex flex-col items-center">
                <DocumentCard
                  document={documents.COVER_PHOTO[0]}
                  onDeleteSuccess={fetchDocuments}
                />
                <p className="text-sm italic text-center">
                  Supprimez la photo pour en télécharger une nouvelle.
                </p>
              </div>
            ) : (
              <DocumentUploadButton
                category="COVER_PHOTO"
                allowedMimeTypes={["image/png", "image/jpeg", "image/webp"]}
                label="Ajouter votre photo de couverture"
                onUploadSuccess={fetchDocuments}
              />
            )}
          </div>

          {/* CATALOG (Supplier only) */}
          {user?.establishmentType === EstablishmentType.SUPPLIER && (
            <div className="flex flex-col items-center w-full md:w-auto">
              <h3 className="text-2xl font-semibold mb-4">Catalogue</h3>
              {documents.CATALOG[0] ? (
                <div className="space-y-3 flex flex-col items-center">
                  <DocumentCard
                    document={documents.CATALOG[0]}
                    onDeleteSuccess={fetchDocuments}
                  />
                  <p className="text-sm italic text-center">
                    Supprimez le catalogue pour en télécharger un nouveau.
                  </p>
                </div>
              ) : (
                <DocumentUploadButton
                  category="CATALOG"
                  allowedMimeTypes={["application/pdf"]}
                  label="Ajouter votre catalogue (PDF)"
                  onUploadSuccess={fetchDocuments}
                />
              )}
            </div>
          )}
        </div>

        {/* GALLERY (Supplier only) */}
        {user?.establishmentType === EstablishmentType.SUPPLIER && (
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-semibold mb-4">
              Galerie photos ({documents.GALLERY_PHOTO.length}/6)
            </h3>

            {documents.GALLERY_PHOTO.length > 0 && (
              <div className="flex flex-wrap gap-6 flex-col sm:flex-row mb-4 max-w-4xl">
                {documents.GALLERY_PHOTO.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onDeleteSuccess={fetchDocuments}
                  />
                ))}
              </div>
            )}

            {documents.GALLERY_PHOTO.length < 6 ? (
              <DocumentUploadButton
                category="GALLERY_PHOTO"
                allowedMimeTypes={["image/png", "image/jpeg", "image/webp"]}
                label="Ajouter une photo"
                onUploadSuccess={fetchDocuments}
              />
            ) : (
              <p className="text-sm italic text-center max-w-md">
                Galerie complète (6 photos maximum). Supprimez une photo pour en
                ajouter une nouvelle.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default DocumentsList;
