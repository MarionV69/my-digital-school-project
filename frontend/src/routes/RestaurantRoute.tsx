import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { EstablishmentType } from "../types/establishments.types";

function RestaurantRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.establishmentId) {
    return <Navigate to="/onboarding/create-establishment" replace />;
  }

  if (user.establishmentType !== EstablishmentType.RESTAURANT) {
    if (user.establishmentType === EstablishmentType.SUPPLIER) {
      return <Navigate to="/supplier/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RestaurantRoute;
