import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  Mail,
  User,
  Settings,
  LogOut,
  LayoutGrid,
  BarChart2,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { EstablishmentType } from "../types/establishments.types";
import { cn } from "../lib/utils";

// ─── Desktop nav link ────────────────────────────────────────────────────────

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "text-sm transition-colors",
          isActive
            ? "font-medium text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )
      }
    >
      {children}
    </NavLink>
  );
}

// ─── Mobile nav link ─────────────────────────────────────────────────────────

function MobileNavItem({
  to,
  icon,
  onClick,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 py-3 text-sm transition-colors",
          isActive ? "font-medium text-foreground" : "text-foreground",
        )
      }
    >
      <span className="text-muted-foreground">{icon}</span>
      {children}
    </NavLink>
  );
}

// ─── Messages icon with badge ─────────────────────────────────────────────────

function MessagesIcon({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  return (
    <Link to="/conversations" className={cn("relative", className)}>
      <Mail className="size-5 text-foreground" />
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}

// ─── AppLayout ────────────────────────────────────────────────────────────────

function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isSupplier = user?.establishmentType === EstablishmentType.SUPPLIER;
  const isRestaurant = user?.establishmentType === EstablishmentType.RESTAURANT;

  // TODO: brancher sur les vraies données
  const unreadCount = 2;

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── NAVBAR ───────────────────────────────────────────────────────── */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img src="/logo.svg" alt="Le Bon Fournisseur" className="h-10" />
          </Link>

          {/* ── Desktop nav links ── */}
          <nav className="hidden items-center gap-8 md:flex">
            {isRestaurant && (
              <>
                <NavItem to="/suppliers">Fournisseurs</NavItem>
                <NavItem to="/favorites">Mes favoris</NavItem>
              </>
            )}
            {isSupplier && (
              <>
                <NavItem to="/profile">Ma fiche</NavItem>
                <NavItem to="/supplier/stats">Mes statistiques</NavItem>
              </>
            )}
          </nav>

          {/* ── Desktop right actions ── */}
          <div className="hidden items-center gap-4 md:flex">
            <MessagesIcon count={unreadCount} />

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-1"
              >
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="size-4" />
                </div>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </button>

              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-11 z-20 min-w-48 rounded-xl border border-border bg-background py-1 shadow-lg">
                    {/* Infos user */}
                    <div className="border-b border-border px-4 py-3">
                      <p className="text-sm font-medium text-foreground">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.establishmentName} ·{" "}
                        {isRestaurant ? "Restaurateur" : "Fournisseur"}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted"
                    >
                      <User className="size-4 text-muted-foreground" />
                      Mon profil
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted"
                    >
                      <Settings className="size-4 text-muted-foreground" />
                      Paramètres
                    </Link>
                    <div className="mt-1 border-t border-border">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted"
                      >
                        <LogOut className="size-4 text-muted-foreground" />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Mobile right actions ── */}
          <div className="flex items-center gap-3 md:hidden">
            <MessagesIcon count={unreadCount} />
            <button onClick={() => setMobileMenuOpen((v) => !v)}>
              {mobileMenuOpen ? (
                <X className="size-5 text-foreground" />
              ) : (
                <Menu className="size-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile menu drawer ── */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background md:hidden">
            <nav className="flex flex-col px-6 py-2">
              {isRestaurant && (
                <>
                  <MobileNavItem
                    to="/suppliers"
                    icon={<Search className="size-4" />}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Fournisseurs
                  </MobileNavItem>
                  <MobileNavItem
                    to="/favorites"
                    icon={<Heart className="size-4" />}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mes favoris
                  </MobileNavItem>
                </>
              )}
              {isSupplier && (
                <>
                  <MobileNavItem
                    to="/profile"
                    icon={<LayoutGrid className="size-4" />}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Ma fiche
                  </MobileNavItem>
                  <MobileNavItem
                    to="/supplier/stats"
                    icon={<BarChart2 className="size-4" />}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Statistiques
                  </MobileNavItem>
                </>
              )}
              <MobileNavItem
                to="/conversations"
                icon={
                  <span className="relative">
                    <Mail className="size-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 flex size-3.5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                        {unreadCount}
                      </span>
                    )}
                  </span>
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Messages
              </MobileNavItem>

              <div className="my-2 border-t border-border" />

              <MobileNavItem
                to="/profile"
                icon={<User className="size-4" />}
                onClick={() => setMobileMenuOpen(false)}
              >
                Mon profil
              </MobileNavItem>
              <MobileNavItem
                to="/settings"
                icon={<Settings className="size-4" />}
                onClick={() => setMobileMenuOpen(false)}
              >
                Paramètres
              </MobileNavItem>

              <div className="my-2 border-t border-border" />

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 py-3 text-sm text-foreground"
              >
                <LogOut className="size-4 text-muted-foreground" />
                Se déconnecter
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* ── PAGE CONTENT ─────────────────────────────────────────────────── */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
