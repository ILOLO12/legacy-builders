import { useQueries } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, Users, Activity, Handshake, Image, MessageSquareQuote } from "lucide-react";

const stats = [
  { key: "articles", label: "Articles", icon: Newspaper, table: "articles" as const },
  { key: "team", label: "Membres d'équipe", icon: Users, table: "team_members" as const },
  { key: "activities", label: "Activités", icon: Activity, table: "activities" as const },
  { key: "partners", label: "Partenaires", icon: Handshake, table: "partners" as const },
  { key: "gallery", label: "Médias", icon: Image, table: "gallery" as const },
  { key: "testimonials", label: "Témoignages", icon: MessageSquareQuote, table: "testimonials" as const },
];

const AdminDashboard = () => {
  const results = useQueries({
    queries: stats.map((s) => ({
      queryKey: ["admin-count", s.table],
      queryFn: async () => {
        const { count } = await supabase.from(s.table).select("*", { count: "exact", head: true });
        return count ?? 0;
      },
    })),
  });
  const counts = stats.map((s, i) => ({ ...s, count: results[i].data ?? 0 }));

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Tableau de bord</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {counts.map(({ key, label, icon: Icon, count }) => (
          <div key={key} className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <Icon className="text-accent" size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{count}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
