import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div>
      <h1>404 - Page introuvable</h1>
      <Link className="btn" to="/">
        <ArrowLeft /> Retour à la page d'accueil
      </Link>
    </div>
  );
}
export default NotFoundPage;
