import { Link } from "react-router";
import { Button } from "../ui/button";
import heartMascot from "@/assets/mascot/heart_mascot.svg";

export default function Cta() {
  return (
    <section className="relative flex flex-col  overflow-hidden px-4 py-8 lg:py-12 lg:px-24 items-center">
      <img
        src={heartMascot}
        alt=""
        aria-hidden="true"
        className="block absolute -right-12 bottom-0 w-24 lg:w-52 opacity-50 drop-shadow-md "
      />

      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <span className="text-primary/60 text-sm tracking-widest uppercase">
          Rejoignez le bon fournisseur
        </span>
        <h2 className="text-2xl md:text-5xl font-bold max-w-lg leading-tight">
          Prêt à trouver vos fournisseurs ?
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-sm">
          Gratuit pour les restaurateurs. Inscription en 2 minutes.
        </p>
        <div className="flex flex-col md:flex-row gap-2 mt-4">
          <Link to="/register">
            <Button className="w-full">Créer un compte</Button>
          </Link>
          <Link to="/" onClick={() => window.scrollTo(0, 0)}>
            <Button variant="outline" className="w-full">
              Voir les fournisseurs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
