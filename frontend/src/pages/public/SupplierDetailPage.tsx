import api from "@/api/axiosConfig";
import AboutSection from "@/components/supplier-details/AboutSection";
import CoverPhoto from "@/components/supplier-details/CoverPhoto";
import SupplierHeader from "@/components/supplier-details/SupplierHeader";
import { Spinner } from "@/components/ui/spinner";
import { useFavorites } from "@/hooks/useFavorites";
import type { supplierDetails } from "@/types/supplierDetails.type";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SupplierDetailPage() {

  const { id } = useParams();
  const [supplier, setSupplier] = useState<supplierDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { favorites, handleFavoriteToggle } = useFavorites();

  useEffect(() => {
    async function loadSupplier() {
      try {
        setLoading(true);
        const response = await api.get(`/suppliers/${id}`);
        setSupplier(response.data);
      } catch { 
        setError("Impossible de charger le fournisseur. Veuillez réessayer plus tard.");
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
        <>
          <CoverPhoto supplier={supplier}/>
          <SupplierHeader 
            supplier={supplier}
            isFavorite={favorites.some((fav) => fav.targetId === supplier.id)}
            onFavoriteToggle={() => handleFavoriteToggle(supplier.id)}
          />
          <AboutSection supplier={supplier} />
          {/* Composant ReviewSection à intégrer ici */}
          {/* <ReviewsSection supplierId={supplier.id} /> */}
          {/* Bouton de contact du fournisseur à intégrer ici */}
          {/* <ContactButton supplierId={supplier.id} /> */}
        </>
      )}
    </div>
  );
}
export default SupplierDetailPage;