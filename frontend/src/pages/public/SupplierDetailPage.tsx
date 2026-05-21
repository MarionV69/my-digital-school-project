import api from "@/api/axiosConfig";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import AboutSection from "@/components/supplier-details/AboutSection";
import ContactCard from "@/components/supplier-details/ContactCard";
import CoverPhoto from "@/components/supplier-details/CoverPhoto";
import GallerySection from "@/components/supplier-details/GallerySection";
import InfoSection from "@/components/supplier-details/InfoSection";
import SupplierHeader from "@/components/supplier-details/SupplierHeader";
import { Spinner } from "@/components/ui/spinner";
import useCategories from "@/hooks/useCategories";
import { useFavorites } from "@/hooks/useFavorites";
import useLabels from "@/hooks/useLabels";
import type { supplierDetails } from "@/types/supplierDetails.type";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SupplierDetailPage() {
  const { id } = useParams();
  const [supplier, setSupplier] = useState<supplierDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { favorites, handleFavoriteToggle } = useFavorites();
  const { categories } = useCategories();
  const { labels: allLabels } = useLabels();

  useEffect(() => {
    async function loadSupplier() {
      try {
        setLoading(true);
        const response = await api.get(`/suppliers/${id}`);
        setSupplier(response.data);
      } catch {
        setError(
          "Impossible de charger le fournisseur. Veuillez réessayer plus tard.",
        );
      } finally {
        setLoading(false);
      }
    }
    loadSupplier();
  }, [id]);

  return (
    <div>
      {loading && (
        <div className="flex flex-row w-full items-center justify-center">
          <Spinner />
        </div>
      )}

      {error && <p className="text-destructive">{error}</p>}

      {supplier && (
        <div className="gap-6">
          <CoverPhoto supplier={supplier} />
          <div className="flex flex-col py-8 px-4 lg:py-12 lg:px-24 gap-6">
            <SupplierHeader
              supplier={supplier}
              categories={categories}
              allLabels={allLabels}
              isFavorite={favorites.some((fav) => fav.targetId === supplier.id)}
              onFavoriteToggle={() => handleFavoriteToggle(supplier.id)}
            />
            <hr className="w-full border-t border-border" />
            <div className="w-full flex flex-col lg:flex-row gap-8 items-start">
              <div className="w-full flex flex-col gap-2">
                <AboutSection supplier={supplier} />
                <InfoSection supplier={supplier} />
                <ReviewsSection supplierId={supplier.id} />
                {supplier.galleryPhotos.length > 0 && (
                  <GallerySection supplier={supplier} />
                )}
              </div>
              <ContactCard supplier={supplier} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default SupplierDetailPage;
