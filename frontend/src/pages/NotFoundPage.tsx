import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

import { Button } from "@/components/ui/button";

function NotFoundPage() {
  const navigate = useNavigate();
  console.log("rendre");

  return (
    <main className="min-h-screen bg-primary text-primary-foreground text-center flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <img
          src="/heart-mascot-light.png"
          alt="Mascotte Le Bon Fournisseur"
          className="mx-auto mb-8 w-40 sm:w-48"
        />
        <h1 className="text-7xl sm:text-8xl font-bold mb-4">404</h1>
        <h2 className="text-2xl sm:text-3xl mb-4">
          Oups, cette page n'existe pas !
        </h2>
        <p className="mb-10 max-w-md mx-auto">
          La page que vous recherchez a peut-être été déplacée, supprimée ou n'a
          jamais existé.
        </p>
        <Button
          variant="outline"
          className="border-primary-foreground text-primary-foreground hover:bg-primary-mid hover:border-primary-foreground"
          onClick={() => navigate("/")}
        >
          <Home />
          Retour à l'accueil
        </Button>
      </div>
    </main>
  );
}

export default NotFoundPage;
