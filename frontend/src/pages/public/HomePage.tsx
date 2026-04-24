
import api from "@/api/axiosConfig";
import SearchBar from "@/components/home/SearchBar";
import SupplierCard from "@/components/home/SupplierCard";
import type { Supplier } from "@/types/supplier";
import { useEffect, useState } from "react";

function HomePage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

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

  // Permet d'afficher les fournisseurs dès le premier affichage
  useEffect(() => {
    async function loadSuppliers() {
      await handleSearch("", "");
    }
    loadSuppliers();
  }, []);
  
  return (
    <div className="p-12 gap-12 flex flex-col">
      <SearchBar onSearch={handleSearch} />
      <div className="grid grid-cols-3 gap-4">
        {suppliers.map((supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>
    </div>
  );
}
export default HomePage;
