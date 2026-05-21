import fruitsBg from "@/assets/images/fruits.jpg";
import {
  Check,
  FileText,
  Heart,
  MapPin,
  MessageSquare,
  Star,
} from "lucide-react";
import { Badge } from "../ui/badge";

export default function Features() {
  return (
    <section className="flex flex-col gap-8 px-4 py-8 lg:py-12 lg:px-24 items-center">
      {/* Section Restaurateurs */}
      <div className="flex flex-col md:flex-row md:w-10/12 gap-8 lg:items-center justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-light text-sm">
            POUR LES RESTAURATEURS
          </p>
          <h3>Le bon fournisseur, près de chez vous.</h3>
          <p className="text-muted-foreground text-sm">
            Filtres, avis vérifiés, catalogues. Tout pour choisir en confiance.
          </p>
          <ul className="flex flex-col gap-2">
            <li className="flex items-center gap-2 text-sm text-shadow-muted-foreground">
              <Check className="w-5 h-5 p-1 bg-primary/80 rounded-full text-white shrink-0" />
              Filtres avancés : catégorie, zone, labels
            </li>
            <li className="flex items-center gap-2 text-sm text-shadow-muted-foreground">
              <Check className="w-5 h-5 p-1 bg-primary/80 rounded-full text-white shrink-0" />
              Avis vérifiés par d'autres restaurateurs
            </li>
            <li className="flex items-center gap-2 text-sm text-shadow-muted-foreground">
              <Check className="w-5 h-5 p-1 bg-primary/80 rounded-full text-white shrink-0" />
              Accès aux catalogues et grilles tarifaires
            </li>
            <li className="flex items-center gap-2 text-sm text-shadow-muted-foreground">
              <Check className="w-5 h-5 p-1 bg-primary/80 rounded-full text-white shrink-0" />
              Gratuit, sans abonnement ni commission
            </li>
          </ul>
        </div>
        <div className="flex flex-col md:w-96 border-1 border-card/80 rounded-lg cursor-pointer group transition-colors h-full duration-1000 hover:border-card hover:bg-muted/40">
          <div className="h-48 overflow-hidden rounded-t-lg relative">
            <button className="absolute top-2 right-2 bg-white/90 p-2 rounded-full z-10 cursor-pointer group/heart transition-color duration-300 hover:bg-white">
              <Heart
                size={18}
                className={`transition-transform duration-150`}
              />
            </button>
            <img
              src={fruitsBg}
              alt="Producteur de fruits"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <span className="absolute bottom-2 left-2 bg-black/90 text-white text-sm px-2 py-1 rounded-full z-10">
              Fruits & Légumes
            </span>
          </div>
          <div className="flex flex-col p-6 gap-3">
            <div className="flex flex-row items-baseline gap-4">
              <h4 className="w-full">Les jardins de Miribel</h4>
              <div className="flex flex-row gap-1 items-center">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <p>4.7</p>
                <p className="text-muted-foreground text-xs">(19)</p>
              </div>
            </div>
            <div className="flex flex-row gap-0.5 items-center">
              <MapPin size={14}></MapPin>
              <p className="text-muted-foreground">Miribel</p>
            </div>
            <div className="flex flex-wrap gap-0.5 items-center">
              <Badge>Bio</Badge>
              <Badge>Bio</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-border" />

      {/* Section Fournisseurs */}
      <div className="flex flex-col md:flex-row md:w-10/12 gap-8 items-center justify-between">
        <div className="flex flex-row">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1 rounded-lg bg-muted p-4">
              <Heart className="size-5 text-primary-mid fill-primary-mid" />
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Mis en favoris
              </span>
              <span className="text-4xl font-semibold text-foreground">87</span>
            </div>

            <div className="flex flex-col gap-1 rounded-lg bg-muted p-4">
              <Star className="size-5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Note moyenne
              </span>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-semibold text-foreground">
                  4.9
                </span>
                <span className="text-lg font-semibold text-muted-foreground/80">
                  /5
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1 rounded-lg bg-muted p-4">
              <MessageSquare className="size-5 text-muted-foreground/80 fill-muted-foreground/80" />
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Avis reçus
              </span>
              <span className="text-4xl font-semibold text-foreground">42</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-light text-sm">
            POUR LES FOURNISSEURS
          </p>
          <h3>Votre vitrine face aux restaurateurs.</h3>
          <p className="text-muted-foreground text-sm">
            Une fiche, vos labels, vos stats. Les clients viennent à vous.
          </p>
          <ul className="flex flex-col gap-2">
            <li className="flex items-center gap-2 text-sm text-shadow-muted-foreground">
              <Check className="w-5 h-5 p-1 bg-primary/80 rounded-full text-white shrink-0" />
              Fiche visible par des centaines de restaurateurs
            </li>
            <li className="flex items-center gap-2 text-sm text-shadow-muted-foreground">
              <Check className="w-5 h-5 p-1 bg-primary/80 rounded-full text-white shrink-0" />
              Téléversez catalogues et certifications
            </li>
            <li className="flex items-center gap-2 text-sm text-shadow-muted-foreground">
              <Check className="w-5 h-5 p-1 bg-primary/80 rounded-full text-white shrink-0" />
              Tableau de bord avec vos statistiques
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full h-px bg-border" />

      {/* Section Restaurateurs */}
      <div className="flex flex-col md:flex-row md:w-10/12 gap-8 items-center justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-light text-sm">
            MESSAGERIE INTÉGRÉE
          </p>
          <h3>Parlez-vous directement.</h3>
          <p className="text-muted-foreground text-sm">
            Besoins, devis, fichiers — tout s'échange en privé, sans passer par
            un tiers.
          </p>
          <ul className="flex flex-col gap-2">
            <li className="flex items-center gap-2 text-sm text-shadow-muted-foreground">
              <Check className="w-5 h-5 p-1 bg-primary/80 rounded-full text-white shrink-0" />
              Messagerie sécurisée
            </li>
            <li className="flex items-center gap-2 text-sm text-shadow-muted-foreground">
              <Check className="w-5 h-5 p-1 bg-primary/80 rounded-full text-white shrink-0" />
              Partage de fichiers PDF, devis, listes
            </li>
            <li className="flex items-center gap-2 text-sm text-shadow-muted-foreground">
              <Check className="w-5 h-5 p-1 bg-primary/80 rounded-full text-white shrink-0" />
              Notifications
            </li>
          </ul>
        </div>
        <div className="flex flex-col p-4 bg-muted/25 rounded-lg">
          <div className="mb-4 flex flex-col items-start">
            <span className="mb-1 px-1 text-xs text-muted-foreground">
              14:13
            </span>
            <div className="max-w-[70%] rounded-lg rounded-tl-none bg-muted px-4 py-2">
              <p className="text-sm whitespace-pre-wrap">
                Bonjour, livrez-vous le lundi matin avant 8h ?
              </p>
            </div>
          </div>
          <div className="mb-4 flex flex-col items-end">
            <span className="mb-1 px-1 text-xs text-muted-foreground">
              14:24
            </span>
            <div className="max-w-[70%] rounded-lg rounded-tr-none bg-primary text-primary-foreground px-4 py-2">
              <p className="text-sm whitespace-pre-wrap">
                Bonjour ! Oui, nous livrons lundi, mercredi et vendredi avant
                7h30.
              </p>
            </div>
          </div>
          <div className="mb-4 flex flex-col items-start">
            <span className="mb-1 px-1 text-xs text-muted-foreground">
              14:31
            </span>
            <div className="max-w-[70%] rounded-lg rounded-tl-none bg-muted px-4 py-2">
              <p className="text-sm whitespace-pre-wrap">
                Super, voici notre liste de besoins.
              </p>
              <div className="mt-2 space-y-1.5">
                <button className="flex items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-muted/80 text-foreground transition-colors">
                  <FileText className="size-4 shrink-0" />
                  <span className="text-sm">tarifs.pdf</span>
                  <span className="shrink-0 text-xs opacity-70">(142 Ko)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
