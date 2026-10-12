import { useQuery } from "@tanstack/react-query";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Users, Eye, TrendingUp, CalendarDays, CalendarRange, Calendar, Infinity as InfinityIcon } from "lucide-react";
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

const StatTile = ({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Eye }) => (
  <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
      <Icon size={16} className="text-accent" />
    </div>
    <p className="text-3xl font-serif font-bold text-foreground">{value.toLocaleString()}</p>
    <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{label}</p>
  </div>
);

const RankedList = ({ items, icon: Icon, title, emptyLabel }: {
  items: { path: string; views: number }[];
  icon: typeof Eye;
  title: string;
  emptyLabel: string;
}) => {
  const max = Math.max(1, ...items.map((i) => i.views));
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className="text-accent" />
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.path}>
              <div className="flex items-center justify-between text-sm mb-1">
                <code className="text-xs text-foreground truncate pr-2">{item.path}</code>
                <span className="text-muted-foreground flex-shrink-0">{item.views}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${Math.max(4, (item.views / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

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
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Statistiques de visite</h1>
        <p className="text-sm text-muted-foreground mt-1">Fréquentation réelle du site, basée sur les pages vues.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatTile label="Aujourd'hui" value={data.today} icon={Calendar} />
        <StatTile label="Cette semaine" value={data.this_week} icon={CalendarDays} />
        <StatTile label="Ce mois" value={data.this_month} icon={CalendarRange} />
        <StatTile label="Cette année" value={data.this_year} icon={CalendarRange} />
        <StatTile label="Total" value={data.total} icon={InfinityIcon} />
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-accent" />
          <h3 className="font-semibold text-foreground">Visiteurs — 30 derniers jours</h3>
        </div>
        {data.daily_series.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Pas encore de données.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.daily_series}>
              <defs>
                <linearGradient id="visitorsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(d) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })}
              />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
              <Tooltip
                labelFormatter={(d) => new Date(d as string).toLocaleDateString("fr-FR")}
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
              />
              <Area type="monotone" dataKey="visitors" stroke="hsl(var(--accent))" fill="url(#visitorsFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <RankedList
          items={data.top_pages}
          icon={Eye}
          title="Pages les plus consultées"
          emptyLabel="Pas encore de données."
        />
        <RankedList
          items={data.top_articles}
          icon={Users}
          title="Actualités les plus consultées"
          emptyLabel="Pas encore de données."
        />
      </div>
    </div>
  );
};

export default AdminAnalytics;
