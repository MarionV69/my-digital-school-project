import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { EstablishmentType } from "../types/establishments.types";

function SupplierRoute() {
  const { user } = useAuth();

  if (!user || user.establishmentType !== EstablishmentType.SUPPLIER) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default SupplierRoute;
