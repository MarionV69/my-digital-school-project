import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

function TermsPage() {
  const navigate = useNavigate();

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <Button onClick={() => navigate(-1)} className="mb-8" size="lg">
        <ArrowLeft />
        Retour
      </Button>

      <h1 className="mb-2">Conditions Générales d'Utilisation</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Dernière mise à jour : juin 2026
      </p>

      <section className="space-y-6 text-sm text-muted-foreground">
        <div>
          <h2 className="text-xl font-semibold mb-1">Présentation</h2>
          <p>
            Cette plateforme met en relation des restaurants et des fournisseurs
            du secteur alimentaire.
          </p>
          <p>
            Éditeur : Le Bon Fournisseur
            <br />
            Contact : contact@lebonfournisseur.fr
            <br />
            SIRET : 123 456 789 00011
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">
            Acceptation des conditions
          </h2>
          <p>
            L'utilisation de la plateforme implique l'acceptation pleine et
            entière des présentes Conditions Générales d'Utilisation.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">Inscription</h2>

          <h3 className="text-base font-semibold mb-1">Conditions d'accès</h3>
          <ul className="list-disc pl-6">
            <li>Professionnels justifiant d'un numéro SIRET valide</li>
            <li>
              Personnes majeures agissant dans le cadre de leur activité
              professionnelle
            </li>
            <li>Un seul compte par établissement (SIRET unique)</li>
          </ul>

          <h3 className="text-base font-semibold mb-1 mt-4">
            Obligations de l'utilisateur
          </h3>
          <ul className="list-disc pl-6">
            <li>Fournir des informations exactes et à jour</li>
            <li>Maintenir la confidentialité de ses identifiants</li>
            <li>Ne créer qu'un seul compte par établissement</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">Services proposés</h2>

          <h3 className="text-base font-semibold mb-1">Pour les restaurants</h3>
          <ul className="list-disc pl-6">
            <li>Recherche de fournisseurs</li>
            <li>Gestion des favoris</li>
            <li>Publication d'avis et notes</li>
            <li>Messagerie privée</li>
            <li>Stockage de documents</li>
          </ul>

          <h3 className="text-base font-semibold mb-1 mt-4">
            Pour les fournisseurs
          </h3>
          <ul className="list-disc pl-6">
            <li>Gestion d'une fiche fournisseur détaillée</li>
            <li>Publication de catalogues et documents</li>
            <li>Gestion des labels et certifications</li>
            <li>Réponse aux avis</li>
            <li>Messagerie privée</li>
            <li>Consultation des favoris</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">
            Obligations des utilisateurs
          </h2>
          <ul className="list-disc pl-6">
            <li>
              Utiliser la plateforme de manière loyale et conforme à sa
              destination
            </li>
            <li>
              Ne pas diffuser de contenus illicites, diffamatoires ou contraires
              aux bonnes mœurs
            </li>
            <li>Publier des informations exactes et sincères</li>
            <li>Respecter la législation en vigueur</li>
          </ul>
          <p>
            En cas de manquement, le compte pourra être suspendu ou supprimé
            sans préavis.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">Système d'avis</h2>
          <ul className="list-disc pl-6">
            <li>Les avis doivent être basés sur une expérience réelle</li>
            <li>
              Un seul avis par restaurant et par fournisseur (modifiable
              ultérieurement)
            </li>
            <li>
              Les avis doivent être rédigés de manière respectueuse et objective
            </li>
            <li>Les fournisseurs disposent d'un droit de réponse</li>
          </ul>
          <p>
            Les avis manifestement diffamatoires, injurieux ou frauduleux
            pourront être supprimés.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">Messagerie</h2>
          <p>
            La plateforme met à disposition un service de messagerie privée
            entre restaurants et fournisseurs.
          </p>
          <ul className="list-disc pl-6">
            <li>Communication professionnelle uniquement</li>
            <li>Conservation des messages pendant 12 mois</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">
            Protection des données personnelles
          </h2>
          <p>Données collectées :</p>
          <ul className="list-disc pl-6">
            <li>Nom, prénom et adresse email</li>
            <li>Données de l'établissement</li>
            <li>Avis, messages et documents publiés</li>
          </ul>
          <p>
            Conformément au RGPD, les utilisateurs disposent d'un droit d'accès,
            de rectification, d'effacement, d'opposition et de portabilité de
            leurs données.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">
            Propriété intellectuelle
          </h2>
          <p>
            La plateforme, son contenu et sa structure sont protégés par le
            droit de la propriété intellectuelle.
          </p>
          <p>
            Les utilisateurs conservent la propriété des contenus qu'ils
            publient mais accordent à la plateforme une licence d'utilisation
            nécessaire à son fonctionnement.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">Responsabilité</h2>
          <p>
            L'éditeur s'engage à mettre en œuvre tous les moyens raisonnables
            pour assurer le bon fonctionnement de la plateforme.
          </p>
          <p>
            Les utilisateurs restent seuls responsables des contenus publiés, de
            leurs échanges et de leurs relations commerciales.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">Durée et résiliation</h2>
          <p>
            L'utilisateur peut supprimer son compte à tout moment depuis son
            espace personnel.
          </p>
          <p>
            Un compte pourra être suspendu ou supprimé en cas de violation des
            présentes CGU, d'informations inexactes ou de comportement
            frauduleux.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">Modification des CGU</h2>
          <p>
            L'éditeur se réserve le droit de modifier les présentes CGU à tout
            moment. La poursuite de l'utilisation de la plateforme vaut
            acceptation des nouvelles conditions.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">Litiges</h2>
          <p>Les présentes CGU sont soumises au droit français.</p>
          <p>
            Pour toute question ou réclamation :
            <br />
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

export default TermsPage;
