import api from "@/api/axiosConfig";
import type { FavoritesSimple } from "@/types/favorites.types";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritesSimple[]>([]);
  const { user } = useAuth();
  const establishmentId = user?.establishmentId;

  // Fonction permettant de récupérer les favoris d'un établissement
  useEffect(() => {
    if (!establishmentId) return;
    async function getFavorites() {
      try {
        const response = await api.get(
          `/establishments/${establishmentId}/favorites`,
        );
        setFavorites(
          response.data.map((fav: { id: number; targetId: number }) => ({
            id: fav.id,
            targetId: fav.targetId,
          })),
        );
      } catch {
        console.error(
          "Impossible de charger les favoris. Veuillez réessayer plus tard.",
        );
      }
    }
    getFavorites();
  }, [user, establishmentId]);

  // Fonction permettant d'ajouter ou de retirer un favoris
  async function handleFavoriteToggle(supplierId: number) {
    if (!establishmentId) return;
    try {
      if (favorites.some((fav) => fav.targetId === supplierId)) {
        const favorite = favorites.find((fav) => fav.targetId === supplierId);
        await api.delete(
          `/establishments/${establishmentId}/favorites/${favorite?.id}`,
        );
        setFavorites(favorites.filter((fav) => fav.targetId !== supplierId));
      } else {
        const response = await api.post(
          `/establishments/${establishmentId}/favorites`,
          {
            targetId: supplierId,
          },
        );
        setFavorites([
          ...favorites,
          { id: response.data.id, targetId: supplierId },
        ]);
      }
    } catch {
      console.error(
        "Impossible de modifier les favoris. Veuillez réessayer plus tard.",
      );
    }
  }

  return { favorites, handleFavoriteToggle };
}
