import { CircleDollarSign, ShieldCheck, MapPin, Lock } from "lucide-react";

export default function Assets() {
  return (
    <section className="flex flex-col gap-8 px-4 py-8 lg:py-12 lg:px-72 bg-primary items-center">
      <h3 className="text-white">Simple. Vérifié. Gratuit.</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="w-auto flex flex-col p-8 gap-2 rounded-lg bg-white/20 border-1 border-white/20">
          <CircleDollarSign className="w-6 h-6 p-1 bg-white/30 rounded-lg text-white shrink-0"></CircleDollarSign>
          <h4 className="text-white">Gratuit pour les restaurants</h4>
          <p className="text-white/80">
            Zéro abonnement, zéro commission. Fournisseurs vérifiés
          </p>
        </div>
        <div className="w-auto flex flex-col p-8 gap-2 rounded-lg bg-white/20 border-1 border-white/20">
          <ShieldCheck className="w-6 h-6 p-1 bg-white/30 rounded-lg text-white shrink-0"></ShieldCheck>
          <h4 className="text-white">Fournisseurs vérifiés</h4>
          <p className="text-white/80">
            SIRET et certifications contrôlés à l'inscription
          </p>
        </div>
        <div className="w-auto flex flex-col p-8 gap-2 rounded-lg bg-white/20 border-1 border-white/20">
          <MapPin className="w-6 h-6 p-1 bg-white/30 rounded-lg text-white shrink-0"></MapPin>
          <h4 className="text-white">Local et de saison</h4>
          <p className="text-white/80">
            Par zone, catégorie et label. Près de chez vous.
          </p>
        </div>
        <div className="w-auto flex flex-col p-8 gap-2 rounded-lg bg-white/20 border-1 border-white/20">
          <Lock className="w-6 h-6 p-1 bg-white/30 rounded-lg text-white shrink-0"></Lock>
          <h4 className="text-white">Messagerie privée</h4>
          <p className="text-white/80">
            Vos échanges restent confidentiels.
          </p>
        </div>
      </div>
    </section>
  );
}
