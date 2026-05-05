import SupplierCard from "@/components/home/SupplierCard";
import { Spinner } from "@/components/ui/spinner";
import useFavoritesWithDetails from "@/hooks/useFavoritesWithDetails"

export default function FavoritesPage() {

  const {favorites, loading, error, handleFavoriteToggle} = useFavoritesWithDetails();

  return (
    <div className="flex flex-col px-4 lg:px-24 py-8 lg:py-12 gap-8">
      <div className="flex flex-col">
        <h3>Mes favoris</h3>
        <p className="text-muted-foreground">{favorites.length} fournisseurs sauvegardés</p>
      </div>
      {loading ? (
        <div className="flex flex-row w-full items-center justify-center">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      ): (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-stretch">
          {favorites.map((fav) => (
            <SupplierCard 
              key={fav.target.id}
              supplier={fav.target}
              isFavorite
              onFavoriteToggle={() => handleFavoriteToggle(fav.target.id)}
            />
          ))}
          {error && <p className="text-destructive">{error}</p>}
      </div>
      )}
    </div>
  )
}
