import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <Button onClick={() => navigate(-1)} className="mb-8" size="lg">
        <ArrowLeft />
        Retour
      </Button>

      <h1 className="mb-2">Politique de confidentialité</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Dernière mise à jour : juin 2026
      </p>

      <section className="space-y-6 text-sm text-muted-foreground">
        <div>
          <h2 className="text-xl font-semibold mb-1">Préambule</h2>
          <p>
            La présente politique de confidentialité décrit comment Le Bon
            Fournisseur collecte, utilise, stocke et protège les données
            personnelles et professionnelles de ses utilisateurs.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">Données collectées</h2>

          <h3 className="text-base font-semibold mb-1">Données de compte</h3>
          <ul className="list-disc pl-6">
            <li>Nom et prénom</li>
            <li>Adresse email</li>
            <li>Mot de passe (stocké sous forme hachée)</li>
          </ul>

          <h3 className="text-base font-semibold mb-1 mt-4">
            Données de l'établissement
          </h3>
          <ul className="list-disc pl-6">
            <li>Raison sociale et nom commercial</li>
            <li>Numéro SIRET</li>
            <li>Adresse postale</li>
            <li>Téléphone et site web éventuel</li>
            <li>Description de l'activité</li>
          </ul>

          <h3 className="text-base font-semibold mb-1 mt-4">
            Données spécifiques aux fournisseurs
          </h3>
          <ul className="list-disc pl-6">
            <li>Type de fournisseur</li>
            <li>Fourchette de prix</li>
            <li>Catégories de produits</li>
            <li>Labels et certifications</li>
            <li>Documents et photos publiés</li>
          </ul>

          <h3 className="text-base font-semibold mb-1 mt-4">
            Données d'utilisation
          </h3>
          <ul className="list-disc pl-6">
            <li>Messages échangés sur la plateforme</li>
            <li>Favoris enregistrés</li>
            <li>Avis et notes publiés</li>
            <li>Date de création du compte</li>
            <li>Date de dernière connexion</li>
          </ul>
          <p>La plateforme ne collecte aucune donnée bancaire.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">
            Finalités du traitement
          </h2>
          <p>Les données sont utilisées afin de :</p>
          <ul className="list-disc pl-6">
            <li>Créer et gérer les comptes utilisateurs</li>
            <li>Permettre la mise en relation entre utilisateurs</li>
            <li>Assurer le fonctionnement de la messagerie</li>
            <li>Afficher les profils et les avis</li>
            <li>Sécuriser l'accès à la plateforme</li>
            <li>Améliorer les fonctionnalités du service</li>
          </ul>
          <p>Les données ne sont jamais vendues à des tiers.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">
            Base légale du traitement
          </h2>
          <p>
            Le traitement des données repose sur l'exécution du service proposé
            par la plateforme ainsi que sur le consentement de l'utilisateur
            lors de son inscription.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">
            Hébergement et stockage
          </h2>
          <p>
            Les données et documents déposés sur la plateforme sont hébergés
            auprès de prestataires cloud utilisés pour le fonctionnement du
            service. Les échanges avec les serveurs sont chiffrés.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">Sécurité des données</h2>
          <p>
            Des mesures techniques et organisationnelles sont mises en œuvre
            afin de protéger les données :
          </p>
          <ul className="list-disc pl-6">
            <li>Authentification sécurisée</li>
            <li>Mots de passe hachés</li>
            <li>Contrôle des autorisations</li>
            <li>Validation des données reçues par l'API</li>
            <li>Protection des documents partagés</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">Partage des données</h2>
          <p>Les données ne sont pas partagées à des fins commerciales.</p>
          <p>
            Certaines informations sont toutefois visibles dans le cadre du
            fonctionnement normal de la plateforme :
          </p>
          <ul className="list-disc pl-6">
            <li>Les profils fournisseurs publics</li>
            <li>Les avis publiés</li>
            <li>Les messages échangés entre participants à une conversation</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">Durée de conservation</h2>
          <p>
            Les données sont conservées tant que le compte utilisateur reste
            actif.
          </p>
          <p>
            En cas de suppression du compte, les données associées sont
            supprimées de la plateforme.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">Vos droits</h2>
          <p>
            Conformément à la réglementation applicable, vous disposez d'un
            droit d'accès, de rectification, d'effacement et d'opposition
            concernant vos données personnelles.
          </p>
          <p>Contact : contact@lebonfournisseur.fr</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">Cookies</h2>
          <p>
            La plateforme n'utilise pas de cookies publicitaires ou de suivi.
          </p>
          <p>
            Un identifiant de connexion peut être conservé dans le navigateur
            afin d'assurer le bon fonctionnement du service.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">
            Modification de la politique
          </h2>
          <p>
            Cette politique de confidentialité peut être amenée à évoluer. Toute
            modification importante sera communiquée aux utilisateurs via la
            plateforme.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">Contact</h2>
          <p>
            Pour toute question relative à la protection des données :
            contact@lebonfournisseur.fr
          </p>
        </div>
      </section>

      <Button onClick={() => navigate(-1)} className="mt-12" size="lg">
        <ArrowLeft />
        Retour
      </Button>
    </main>
  );
}

export default PrivacyPage;
