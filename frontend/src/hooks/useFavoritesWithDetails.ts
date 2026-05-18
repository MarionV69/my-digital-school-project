import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import api from "@/api/axiosConfig";
import type { FavoritesType } from "@/types/favorites.types";

export default function useFavoritesWithDetails() {
  const { user } = useAuth();
  const establishmentId = user?.establishmentId;
  const [favorites, setFavorites] = useState<FavoritesType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ici, on veut récupérer tous les fournisseurs mis en favoris par l'établissement concerné
  useEffect(() => {
    if (!establishmentId) return;
    async function getFavorites() {
      try {
        setLoading(true);
        setError(null);
        // On récupère tous les favoris de l'établissement
        const favoritesResponses = await api.get(
          `/establishments/${establishmentId}/favorites`,
        );
        const favorites: FavoritesType[] = favoritesResponses.data;

        // On récupère tous les fournisseurs faisant partis des favoris
        const supplierResponses = await Promise.all(
          favorites.map((fav) => api.get(`/suppliers/${fav.targetId}`)),
        );

        // On lie le résultat du fournisseur au favoris
        const favoritesWithDetails = favorites.map((fav, index) => ({
          ...fav,
          target: supplierResponses[index].data,
        }));

        setFavorites(favoritesWithDetails);
      } catch {
        setError(
          "Impossible de charger les favoris pour le moment. Veuillez réessayer plus tard.",
        );
      } finally {
        setLoading(false);
      }
    }
    getFavorites();
  }, [establishmentId]);

  // Fonction permettant d'ajouter ou de retirer un favoris
  async function handleFavoriteToggle(supplierId: number) {
    if (!user) return;
    try {
      if (favorites.some((fav) => fav.target.id === supplierId)) {
        const favorite = favorites.find((fav) => fav.target.id === supplierId);
        await api.delete(
          `/establishments/${establishmentId}/favorites/${favorite?.id}`,
        );
        setFavorites(favorites.filter((fav) => fav.target.id !== supplierId));
      }
    } catch {
      console.error(
        "Impossible de modifier les favoris. Veuillez réessayer plus tard.",
      );
    }
  }

  return { favorites, loading, error, handleFavoriteToggle };
}
