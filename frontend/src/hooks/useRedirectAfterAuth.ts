import { useLocation, useNavigate } from "react-router-dom";
import { createConversation } from "@/api/conversations";
import { EstablishmentType } from "@/types/establishments.types";
import type { ContactButtonLocationState } from "@/types/navigation.types";

export function useRedirectAfterAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ContactButtonLocationState | undefined;
  const supplierId = state?.supplierId;

  const redirectAfterAuth = async (
    establishmentType: EstablishmentType | null,
    establishmentId: number | null,
  ) => {
    if (!establishmentId) {
      navigate("/onboarding/create-establishment", { state });
      return;
    }

    if (supplierId && establishmentType === EstablishmentType.RESTAURANT) {
      try {
        const conversation = await createConversation(supplierId);
        navigate(`/conversations/${conversation.id}`);
        return;
      } catch (error) {
        console.error("Error creating conversation:", error);
        navigate("/");
        return;
      }
    }

    if (establishmentType === EstablishmentType.SUPPLIER) {
      navigate("/profile");
      return;
    }
    navigate("/");
  };

  return { redirectAfterAuth };
}
