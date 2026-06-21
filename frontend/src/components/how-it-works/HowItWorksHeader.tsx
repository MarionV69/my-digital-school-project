import arbreBg from "@/assets/images/arbre.webp";
import { Badge } from "../ui/badge";

export default function HowItWorksHeader() {
  return (
    <section
      className="relative bg-cover bg-center min-h-120"
      style={{ backgroundImage: `url(${arbreBg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-120 px-4 py-12 gap-4">
        <Badge className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-1.5 text-sm tracking-widest uppercase">
          Le Bon Fournisseur
        </Badge>
        <h1 className="text-white text-4xl md:text-6xl font-bold text-center leading-tight max-w-2xl">
          Simple, direct,
          <br />
          sans intermédiaire.
        </h1>
        <p className="text-white/80 text-base md:text-lg text-center max-w-md">
          Producteurs locaux vérifiés. Fiches, tarifs, messagerie. Direct.
        </p>
      </div>
    </section>
  );
}
