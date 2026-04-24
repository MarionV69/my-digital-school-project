
import api from "@/api/axiosConfig";
import Filters from "@/components/home/Filters";
import SearchBar from "@/components/home/SearchBar";
import SupplierCard from "@/components/home/SupplierCard";
import type { filtersType } from "@/types/filters";
import type { supplierType } from "@/types/supplier";
import { useEffect, useState } from "react";

function HomePage() {

  const [suppliers, setSuppliers] = useState<supplierType[]>([]);

  const [filters, setFilters] = useState<filtersType>({
    productCategories: [],
    labels: [],
    minRating: 0,
    supplierTypes: [],
    isPremium: false,
  })

  // Fonction permettant de rechercher des fournisseurs par nom ou par ville
  async function handleSearch(search: string, city: string) {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (city) params.city = city;

      try {
        const response = await api.get('/suppliers', {params});
        console.log("Réponse reçue : ", response.data)
        setSuppliers(response.data)
      } catch (error) {
        console.error("Erreur : " , error)
      }
  }

  // Fonction qui permet de filtrer les fournisseurs
  // async function handleFilters() {}

  // Permet d'afficher les fournisseurs dès le premier affichage
  useEffect(() => {
    async function loadSuppliers() {
      await handleSearch("", "");
    }
    loadSuppliers();
  }, []);
  
  return (
    <div className="px-24 pt-12 gap-6 flex flex-col">
      <SearchBar onSearch={handleSearch} />
      <div className="flex flex-row gap-12">
        <Filters ></Filters>
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground text-sm">
            {suppliers.length} fournisseur{suppliers.length > 1 ? "s" : ""} trouvé{suppliers.length > 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {suppliers.map((supplier) => (
              <SupplierCard key={supplier.id} supplier={supplier} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomePage;
