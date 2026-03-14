import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { EstablishmentType } from "../types/establishments.types";

function SupplierRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.establishmentId) {
    return <Navigate to="/onboarding/create-establishment" replace />;
  }

  if (user.establishmentType !== EstablishmentType.SUPPLIER) {
    if (user.establishmentType === EstablishmentType.RESTAURANT) {
      return <Navigate to="/restaurant/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default SupplierRoute;
