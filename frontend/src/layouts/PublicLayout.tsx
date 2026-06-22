import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu, X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "../lib/utils";

function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img src="/logo.svg" alt="Le Bon Fournisseur" className="h-10" />
          </Link>

          {/* Desktop right actions */}
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="outline" size="lg" asChild>
              <Link to="/login">S'inscrire | Se connecter</Link>
            </Button>
            <Button size="lg" className="mr-2" asChild>
              <Link to="/register">Publier une annonce</Link>
            </Button>
            <Link
              to="/how-it-works"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Comment ça marche"
            >
              <HelpCircle className="size-6" strokeWidth={1} />
            </Link>
          </div>

          {/* Mobile right actions */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="size-5 text-foreground" />
              ) : (
                <Menu className="size-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background md:hidden">
            <nav className="flex flex-col gap-2 px-6 py-4">
              <Button variant="outline" asChild>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  S'inscrire | Se connecter
                </Link>
              </Button>
              <Button asChild>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  Publier une annonce
                </Link>
              </Button>
              <Link
                to="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "py-2 text-sm text-muted-foreground hover:text-foreground",
                )}
              >
                Comment ça marche ?
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 py-6">
          <div className="flex justify-center gap-4 sm:gap-6 text-sm text-center text-muted-foreground transition-colors duration-200">
            <Link to="/terms" className="hover:text-card-foreground">
              CGU
            </Link>
            <Link to="/privacy" className="hover:text-card-foreground">
              Politique de confidentialité
            </Link>
            <Link to="/legal" className="hover:text-card-foreground">
              Mentions légales
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default PublicLayout;
