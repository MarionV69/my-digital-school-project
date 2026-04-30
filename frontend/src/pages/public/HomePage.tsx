
import api from "@/api/axiosConfig";
import FilterBottomSheet from "@/components/home/FilterBottomSheet";
import Filters from "@/components/home/Filters";
import SearchBar from "@/components/home/SearchBar";
import SupplierCard from "@/components/home/SupplierCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { favoritesType } from "@/types/favorites";
import type { filtersType } from "@/types/filters";
import type { supplierType } from "@/types/supplier";
import { useEffect, useState } from "react";

function HomePage() {
  const {user} = useAuth();

  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [suppliers, setSuppliers] = useState<supplierType[]>([]);
  const [page, setPage] = useState(0);
  const LIMIT = 9;
  const paginateSuppliers = suppliers.slice(page * LIMIT, (page + 1) * LIMIT);
  const [filters, setFilters] = useState<filtersType>({
    productCategories: [],
    labels: [],
    minRating: 0,
    supplierTypes: [],
    isPremium: false,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [favorites, setFavorites] = useState<favoritesType[]>([]);

  // Ce useEffect() permet d'afficher les fournisseurs en fonction de la recherche et des filtres
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

  // Ce useEffect() permet de récupérer les fournisseurs favoris (si l'utilisateur est connecté)
  useEffect(() => {
    if (!user) return; 

    async function getFavorites() {
      try {
        const response = await api.get(`/establishments/${user?.establishmentId}/favorites`);
        const favoriteIds = response.data.map((fav: {id: number, targetId: number}) => ({
          favoriteId: fav.id,
          targetId: fav.targetId
        }));
        setFavorites(favoriteIds)
      } catch (error) {
        console.error("Erreur :", error);
      }
    }
    getFavorites();
  }, [user])

  // Fonction pour mettre à jour un favoris
  async function handleFavoriteToggle(supplierId: number) {
    try {
      if (!user) {
        console.log("Vous devez être connecté");
        return;
      } 

      if (favorites.some((fav) => fav.targetId === supplierId)) {
        const favorite = favorites.find((fav) => fav.targetId === supplierId);
        await api.delete(`/establishments/${user.establishmentId}/favorites/${favorite?.favoriteId}`);
        setFavorites(favorites.filter((f) => f.targetId !== supplierId));
      } else {
          const response = await api.post(`/establishments/${user.establishmentId}/favorites`, {
            targetId: supplierId
          });
          setFavorites([...favorites, {favoriteId: response.data.id, targetId: supplierId}])
      }
    } catch {
      throw new Error("Erreur")
    }
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
            {paginateSuppliers.map((supplier) => (
              <SupplierCard 
                key={supplier.id} 
                supplier={supplier} 
                isFavorite={favorites.some((fav) => fav.targetId === supplier.id)}
                onFavoriteToggle={() => handleFavoriteToggle(supplier.id)}
              />
            ))}
          </div>
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
