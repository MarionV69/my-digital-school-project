import { Link } from "react-router";

export default function Footer() {
  return (
    <section className="flex justify-between px-4 py-4 lg:px-24 border-t-border border-t-1 items-center md:justify-end">
      <div className="flex flex-row gap-8">
        <Link
          to="/legal"
          className="text-muted-foreground text-sm text-center transition-colors duration-200 hover:text-card-foreground"
        >
          Mentions légales
        </Link>
        <Link
          to="/privacy"
          className="text-muted-foreground text-sm text-center transition-colors duration-200 hover:text-card-foreground"
        >
          Politique de confidentialité
        </Link>
        <Link
          to="/terms"
          className="text-muted-foreground text-sm text-center transition-colors duration-200 hover:text-card-foreground"
        >
          CGU
        </Link>
      </div>
    </section>
  );
}
