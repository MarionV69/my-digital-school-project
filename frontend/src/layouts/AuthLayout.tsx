import { Link, Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-h-screen bg-primary md:grid md:grid-cols-2">
      {/* Left panel - desktop only */}
      <div className="hidden md:flex flex-col p-20">
        <Link to="/">
          <img
            src="/logo-light.svg"
            alt="Le Bon Fournisseur"
            className="h-16"
          />
        </Link>
        <p className="mt-2 text-primary-foreground">La marketplace des pros</p>
      </div>

      {/* Right panel - form */}
      <div className="flex min-h-screen flex-col justify-center bg-background px-6 sm:px-12 md:px-6 lg:px-24 py-12">
        {/* Mobile logo */}
        <div className="mb-8 mx-auto md:hidden">
          <Link to="/">
            <img src="/logo.svg" alt="Le Bon Fournisseur" className="h-12" />
          </Link>
          <p className="mt-1 text-primary font-semibold pb-2">
            La marketplace des pros
          </p>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
