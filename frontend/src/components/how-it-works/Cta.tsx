import { Link } from "react-router";
import { Button } from "../ui/button";

export default function Cta() {
  return (
    <section className="flex flex-col gap-2 px-4 py-8 lg:py-12 lg:px-72 items-center">
      <h2>Lancez-vous</h2>
      <p>Gratuit pour les restaurateurs.</p>
      <div className="flex gap-2 mt-6">
        <Link to="/register">
          <Button>Créer un compte</Button>
        </Link>
        <Link to="/" onClick={() => window.scrollTo(0, 0)}>
            <Button variant="outline">Voir les fournisseurs</Button>
        </Link>
      </div>
    </section>
  );
}
