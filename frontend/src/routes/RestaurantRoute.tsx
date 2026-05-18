import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { EstablishmentType } from "../types/establishments.types";

function RestaurantRoute() {
  const { user } = useAuth();

  if (!user || user.establishmentType !== EstablishmentType.RESTAURANT) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RestaurantRoute;
