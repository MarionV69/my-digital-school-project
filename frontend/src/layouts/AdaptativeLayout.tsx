import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "./AppLayout";
import { EstablishmentType } from "@/types/establishments.types";
import PublicLayout from "./PublicLayout";
import { Navigate } from "react-router-dom";

function AdaptativeLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  // Authenticated supplier => redirect to their space
  if (
    user?.establishmentId &&
    user?.establishmentType === EstablishmentType.SUPPLIER
  ) {
    return <Navigate to="/profile" replace />;
  }

  // Authenticated restaurant => AppLayout
  if (
    user?.establishmentId &&
    user?.establishmentType === EstablishmentType.RESTAURANT
  ) {
    return <AppLayout />;
  }

  // Visitors (unauthenticated) => PublicLayout
  return <PublicLayout />;
}
export default AdaptativeLayout;
