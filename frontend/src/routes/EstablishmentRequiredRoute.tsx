import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";

function EstablishmentRequiredRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!user.establishmentId) {
    return <Navigate to="/onboarding/create-establishment" replace />;
  }

  return <Outlet />;
}
export default EstablishmentRequiredRoute;
