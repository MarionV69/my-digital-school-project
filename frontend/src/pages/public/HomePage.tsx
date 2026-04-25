
import api from "@/api/axiosConfig";
import Filters from "@/components/home/Filters";
import SearchBar from "@/components/home/SearchBar";
import SupplierCard from "@/components/home/SupplierCard";
import type { filtersType } from "@/types/filters";
import type { supplierType } from "@/types/supplier";
import { useEffect, useState } from "react";

function HomePage() {

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  const [suppliers, setSuppliers] = useState<supplierType[]>([]);

  const [filters, setFilters] = useState<filtersType>({
    productCategories: [],
    labels: [],
    minRating: 0,
    supplierTypes: [],
    isPremium: false,
  })

  useEffect(() => {
      async function loadSuppliers() {
          const params: Record<string, string | number | boolean | string[]> = {};

          if (search) params.search = search;
          if (city) params.city = city;
          if (filters.productCategories.length > 0) params.productCategories = filters.productCategories;
          if (filters.labels.length > 0) params.labels = filters.labels;
          if (filters.minRating > 0) params.minRating = filters.minRating;
          if (filters.isPremium) params.isPremium = filters.isPremium;
          if (filters.supplierTypes.length > 0) params.supplierTypes = filters.supplierTypes;

          try {
              const response = await api.get('/suppliers', { 
                params, 
                paramsSerializer: (params) => {
                  return Object.entries(params)
                      .map(([key, value]) => {
                          if (Array.isArray(value)) {
                              return value.map(v => `${key}=${encodeURIComponent(v)}`).join('&');
                          }
                          return `${key}=${encodeURIComponent(value)}`;
                      })
                      .join('&');
                  } 
              });
              setSuppliers(response.data);
          } catch (error) {
              console.error("Erreur :", error);
          }
      }
      loadSuppliers();
  }, [search, city, filters]); 


    // Quand la SearchBar soumet
    function handleSearch(search: string, city: string) {
      setSearch(search);
      setCity(city);
    }
  
  return (
    <div className="px-24 pt-12 gap-6 flex flex-col">
      <SearchBar onSearch={handleSearch} />
      <div className="w-full flex flex-row gap-12">
        <Filters filters={filters} onChange={setFilters}></Filters>
        <div className="flex flex-col gap-3 w-full">
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
