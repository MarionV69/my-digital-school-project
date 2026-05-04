import FilterBottomSheet from "@/components/home/FilterBottomSheet";
import Filters from "@/components/home/Filters";
import SearchBar from "@/components/home/SearchBar";
import SupplierCard from "@/components/home/SupplierCard";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useFavorites } from "@/hooks/useFavorites";
import { useSuppliers } from "@/hooks/useSuppliers";
import type { filtersType } from "@/types/filters";
import { useState } from "react";

const LIMIT = 9;

function HomePage() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<filtersType>({
    productCategories: [],
    labels: [],
    minRating: 0,
    supplierTypes: [],
    isPremium: false,
  });
  const { suppliers, error, loading } = useSuppliers(search, city, filters);
  const paginateSuppliers = suppliers.slice(page * LIMIT, (page + 1) * LIMIT);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { favorites, handleFavoriteToggle } = useFavorites();

  // Quand la SearchBar soumet
  function handleSearch(search: string, city: string) {
    setSearch(search);
    setCity(city);
  }

  return (
    <div className="px-4 lg:px-24 pt-6 lg:pt-12 mb-24 gap-6 flex flex-col">
      <SearchBar onSearch={handleSearch} onFilterOpen={() => {setIsFilterOpen(true)}}/>
      <div className="w-full flex flex-row gap-12">
        <div className="hidden lg:block">
          <Filters filters={filters} onChange={setFilters} ></Filters>
        </div>
        <FilterBottomSheet 
          isOpen={isFilterOpen}
          filters={filters}
          onChange={setFilters}
          onClose={() => setIsFilterOpen(false)}
        ></FilterBottomSheet>
        <div className="flex flex-col gap-3 w-full">
          <p className="text-muted-foreground text-sm">
            {suppliers.length} fournisseur{suppliers.length > 1 ? "s" : ""} trouvé{suppliers.length > 1 ? "s" : ""}
          </p>
          {loading ? (
              <div className="flex flex-row w-full items-center justify-center">
                <Spinner />
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-start ">
              {paginateSuppliers.map((supplier) => (
                <SupplierCard 
                  key={supplier.id} 
                  supplier={supplier} 
                  isFavorite={favorites.some((fav) => fav.targetId === supplier.id)}
                  onFavoriteToggle={() => handleFavoriteToggle(supplier.id)}
                />
              ))}
              {error && <p className="text-destructive">{error}</p>}
            </div>
            )}
          <div className="flex flex-row justify-center items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page===0}
            >
              Précédent
            </Button>
            <Button
              onClick={() => setPage(page + 1)}
              disabled={(page + 1) * LIMIT >= suppliers.length}
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomePage;
