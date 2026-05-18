import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { EstablishmentType } from "@/types/establishments.types";
import { Button } from "@/components/ui/button";

function ConfirmationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStart = () => {
    if (user?.establishmentType === EstablishmentType.SUPPLIER) {
      navigate("/profile");
    } else {
      navigate("/");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-primary px-6 text-center">
      {/* Mascot */}
      <img
        src="/mascot-light.svg"
        alt="Le Bon Fournisseur"
        className="h-40 w-32 object-contain"
      />

      {/* Message */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-primary-foreground ">
          Compte créé avec succès
        </h1>
        <p className="text-sm text-primary-foreground/80">
          Bienvenue sur Le Bon Fournisseur.
        </p>
      </div>

      {/* CTA */}
      <Button
        onClick={handleStart}
        size="sm"
        className="w-full max-w-sm bg-primary-foreground text-primary hover:bg-primary-foreground/90"
      >
        Commencer
      </Button>
    </main>
  );
}

export default ConfirmationPage;
