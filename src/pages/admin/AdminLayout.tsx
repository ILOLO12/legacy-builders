import { useEffect } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Newspaper, Users, Activity, Handshake, Image, MessageSquareQuote,
  Settings, LayoutDashboard, LogOut, FileText, CalendarDays, FolderOpen, BarChart3, Share2, AlertTriangle,
} from "lucide-react";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Tableau de bord", end: true },
  { to: "/admin/analytics", icon: BarChart3, label: "Statistiques" },
  { to: "/admin/pages", icon: FileText, label: "Pages du site" },
  { to: "/admin/articles", icon: Newspaper, label: "Articles" },
  { to: "/admin/team", icon: Users, label: "Équipe" },
  { to: "/admin/activities", icon: Activity, label: "Activités" },
  { to: "/admin/events", icon: CalendarDays, label: "Événements" },
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

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-sidebar-border">
          <h2 className="text-lg font-serif font-bold text-sidebar-primary">MUFO Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
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
        </nav>
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

      {/* Main content */}
      <main className="flex-1 bg-muted overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
