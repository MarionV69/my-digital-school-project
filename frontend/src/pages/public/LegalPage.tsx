import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

function LegalPage() {
  const navigate = useNavigate();

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <Button onClick={() => navigate(-1)} className="mb-8">
        <ArrowLeft />
        Retour
      </Button>

      <h1 className="mb-2">Mentions légales</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Dernière mise à jour : juin 2026
      </p>

      <section className="space-y-8">
        <div>
          <h2 className="mb-3">Éditeur de la plateforme</h2>
          <p>
            <strong>Le Bon Fournisseur</strong>
          </p>
          <p className="mt-2">
            Projet réalisé dans le cadre du module MyDigitalProject de
            MyDigitalSchool Lyon.
          </p>
          <p className="mt-2">
            Contact : contact@lebonfournisseur.fr
            <br />
            SIRET : 123 456 789 00011
          </p>
        </div>

        <div>
          <h2 className="mb-3">Responsable de publication</h2>
          <p>L'équipe projet Le Bon Fournisseur.</p>
        </div>

        <div>
          <h2 className="mb-3">Hébergement</h2>
          <p>
            L'application est hébergée auprès de prestataires cloud utilisés
            pour le fonctionnement de la plateforme.
          </p>
        </div>

        <div>
          <h2 className="mb-3">Propriété intellectuelle</h2>
          <p>
            Les contenus, textes, illustrations, logos et éléments graphiques
            présents sur cette plateforme sont protégés par les règles relatives
            à la propriété intellectuelle.
          </p>
          <p className="mt-2">
            Toute reproduction ou réutilisation sans autorisation préalable est
            interdite.
          </p>
        </div>

        <div>
          <h2 className="mb-3">Limitation de responsabilité</h2>
          <p>
            Cette plateforme est présentée dans le cadre d'un projet
            pédagogique. Malgré le soin apporté à son développement, aucune
            garantie n'est donnée quant à l'absence d'erreurs ou
            d'indisponibilités temporaires.
          </p>
        </div>

        <div>
          <h2 className="mb-3">Contact</h2>
          <p>
            Pour toute question relative à la plateforme :
            contact@lebonfournisseur.fr
          </p>
        </div>
      </section>

      <Button onClick={() => navigate(-1)} className="mt-12">
        <ArrowLeft />
        Retour
      </Button>
    </main>
  );
}

export default LegalPage;
