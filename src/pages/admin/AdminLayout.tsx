import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation, NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  Newspaper, Users, Activity, Handshake, Image, MessageSquareQuote,
  Settings, LayoutDashboard, LogOut, FileText, CalendarDays, FolderOpen, BarChart3, Share2, AlertTriangle,
  Mail, UserPlus, Briefcase, Menu,
} from "lucide-react";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Tableau de bord", end: true },
  { to: "/admin/analytics", icon: BarChart3, label: "Statistiques" },
  { to: "/admin/messages", icon: Mail, label: "Messages" },
  { to: "/admin/memberships", icon: UserPlus, label: "Adhésions" },
  { to: "/admin/pages", icon: FileText, label: "Pages du site" },
  { to: "/admin/articles", icon: Newspaper, label: "Articles" },
  { to: "/admin/team", icon: Users, label: "Équipe" },
  { to: "/admin/activities", icon: Activity, label: "Activités" },
  { to: "/admin/events", icon: CalendarDays, label: "Événements" },
  { to: "/admin/volunteer", icon: Briefcase, label: "Volontariat" },
  { to: "/admin/social", icon: Share2, label: "Réseaux sociaux" },
  { to: "/admin/partners", icon: Handshake, label: "Partenaires" },
  { to: "/admin/gallery", icon: Image, label: "Galerie" },
  { to: "/admin/testimonials", icon: MessageSquareQuote, label: "Témoignages" },
  { to: "/admin/media", icon: FolderOpen, label: "Médiathèque" },
  { to: "/admin/logs", icon: AlertTriangle, label: "Journal d'erreurs" },
  { to: "/admin/settings", icon: Settings, label: "Paramètres" },
];

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const navLinks = (
    <>
      {navItems.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </>
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex w-64 bg-sidebar text-sidebar-foreground flex-col flex-shrink-0">
        <div className="p-6 border-b border-sidebar-border">
          <h2 className="text-lg font-serif font-bold text-sidebar-primary">MUFO Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">{navLinks}</nav>
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => signOut().then(() => navigate("/admin/login"))}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors w-full"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-sidebar text-sidebar-foreground flex items-center justify-between px-4 h-14 border-b border-sidebar-border">
        <h2 className="text-base font-serif font-bold text-sidebar-primary">MUFO Admin</h2>
        <button
          onClick={() => setMobileNavOpen(true)}
          aria-label="Ouvrir le menu"
          className="p-2 -mr-2 text-sidebar-foreground"
        >
          <Menu size={22} />
        </button>
      </div>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="bg-sidebar text-sidebar-foreground border-sidebar-border p-0 w-72 flex flex-col">
          <SheetTitle className="sr-only">Menu admin</SheetTitle>
          <div className="p-6 border-b border-sidebar-border">
            <h2 className="text-lg font-serif font-bold text-sidebar-primary">MUFO Admin</h2>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">{navLinks}</nav>
          <div className="p-4 border-t border-sidebar-border">
            <button
              onClick={() => signOut().then(() => navigate("/admin/login"))}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors w-full"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 bg-muted overflow-auto pt-14 lg:pt-0">
        <div className="p-4 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
