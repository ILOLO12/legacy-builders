import { useQuery } from "@tanstack/react-query";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Users, Eye, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsSummary {
  total: number;
  today: number;
  this_week: number;
  this_month: number;
  this_year: number;
  daily_series: { day: string; visitors: number }[];
  top_pages: { path: string; views: number }[];
  top_articles: { path: string; views: number }[];
}

const StatTile = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-card border border-border rounded-xl p-5">
    <p className="text-3xl font-serif font-bold text-foreground">{value.toLocaleString()}</p>
    <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{label}</p>
  </div>
);

const AdminAnalytics = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics-summary"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_analytics_summary");
      if (error) throw error;
      return data as unknown as AnalyticsSummary;
    },
  });

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Chargement...</div>;
  }

  if (error || !data) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Les statistiques ne sont pas encore disponibles (migration `page_views` non appliquée, ou aucune visite enregistrée).
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Statistiques de visite</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatTile label="Aujourd'hui" value={data.today} />
        <StatTile label="Cette semaine" value={data.this_week} />
        <StatTile label="Ce mois" value={data.this_month} />
        <StatTile label="Cette année" value={data.this_year} />
        <StatTile label="Total" value={data.total} />
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-accent" />
          <h3 className="font-semibold text-foreground">Visiteurs — 30 derniers jours</h3>
        </div>
        {data.daily_series.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Pas encore de données.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data.daily_series}>
              <defs>
                <linearGradient id="visitorsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} tickFormatter={(d) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip labelFormatter={(d) => new Date(d as string).toLocaleDateString("fr-FR")} />
              <Area type="monotone" dataKey="visitors" stroke="hsl(var(--accent))" fill="url(#visitorsFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye size={16} className="text-accent" />
            <h3 className="font-semibold text-foreground">Pages les plus consultées</h3>
          </div>
          {data.top_pages.length === 0 ? (
            <p className="text-sm text-muted-foreground">Pas encore de données.</p>
          ) : (
            <ul className="space-y-2">
              {data.top_pages.map((p) => (
                <li key={p.path} className="flex items-center justify-between text-sm border-b border-border last:border-0 pb-2 last:pb-0">
                  <code className="text-xs text-foreground">{p.path}</code>
                  <span className="text-muted-foreground">{p.views}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-accent" />
            <h3 className="font-semibold text-foreground">Actualités les plus consultées</h3>
          </div>
          {data.top_articles.length === 0 ? (
            <p className="text-sm text-muted-foreground">Pas encore de données.</p>
          ) : (
            <ul className="space-y-2">
              {data.top_articles.map((a) => (
                <li key={a.path} className="flex items-center justify-between text-sm border-b border-border last:border-0 pb-2 last:pb-0">
                  <code className="text-xs text-foreground">{a.path}</code>
                  <span className="text-muted-foreground">{a.views}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
