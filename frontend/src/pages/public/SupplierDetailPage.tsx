import api from "@/api/axiosConfig";
import CoverPhoto from "@/components/supplier-details/CoverPhoto";
import SupplierHeader from "@/components/supplier-details/SupplierHeader";
import type { supplierDetails } from "@/types/supplierDetails.type";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SupplierDetailPage() {

  const { id } = useParams();
  const [supplier, setSupplier] = useState<supplierDetails | null>(null);

  useEffect(() => {
    async function loadSupplier() {
      try {
        const response = await api.get(`/suppliers/${id}`);
        setSupplier(response.data);
      } catch (error) {
        console.error("Erreur :", error)
      }
    }
    loadSupplier();
  }, [id]);

  return (
    <div>
      {supplier && (
        <>
          <CoverPhoto supplier={supplier}/>
          <SupplierHeader supplier={supplier}/>
        </>

      )}
      {/* Bouton de contact du fournisseur à utiliser pour ta page de détail des fournisseurs */}
      {/* <ContactButton supplierId={supplier.id} /> */}
    </div>
  );
}
export default SupplierDetailPage;
