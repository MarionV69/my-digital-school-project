import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function EstablishmentRequiredRoute() {
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

  return <Outlet />;
}
export default EstablishmentRequiredRoute;
