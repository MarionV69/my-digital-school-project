import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRedirectAfterAuth } from "@/hooks/useRedirectAfterAuth";

function ConfirmationPage() {
  const { user } = useAuth();
  const { redirectAfterAuth } = useRedirectAfterAuth();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      await redirectAfterAuth(
        user?.establishmentType ?? null,
        user?.establishmentId ?? null,
      );
    } finally {
      setLoading(false);
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
        disabled={loading}
        size="sm"
        className="w-full max-w-sm bg-primary-foreground text-primary hover:bg-primary-foreground/90"
      >
        {loading ? "Chargement..." : "Commencer"}
      </Button>
    </main>
  );
}

export default ConfirmationPage;
