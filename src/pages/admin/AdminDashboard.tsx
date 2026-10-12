import { useQueries, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Newspaper, Users, Activity, Handshake, Image, MessageSquareQuote,
  Eye, TrendingUp, UserPlus, HeartHandshake, Mail, Briefcase,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";

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

const contentStats = [
  { key: "articles", label: "Articles", icon: Newspaper, table: "articles" as const, color: "sky" },
  { key: "team", label: "Membres d'équipe", icon: Users, table: "team_members" as const, color: "violet" },
  { key: "activities", label: "Activités", icon: Activity, table: "activities" as const, color: "emerald" },
  { key: "partners", label: "Partenaires", icon: Handshake, table: "partners" as const, color: "amber" },
  { key: "gallery", label: "Médias", icon: Image, table: "gallery" as const, color: "rose" },
  { key: "testimonials", label: "Témoignages", icon: MessageSquareQuote, table: "testimonials" as const, color: "indigo" },
];

const colorClasses: Record<string, { bg: string; text: string }> = {
  sky: { bg: "bg-sky-500/10", text: "text-sky-500" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-500" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-500" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-500" },
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-500" },
  accent: { bg: "bg-accent/10", text: "text-accent" },
};

const chartColors = ["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#f43f5e", "#6366f1"];

const HeroStat = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Eye;
  label: string;
  value: number;
  color: string;
}) => {
  const c = colorClasses[color] ?? colorClasses.accent;
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 shadow-sm">
      <div className={`w-11 h-11 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={c.text} size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-serif font-bold text-foreground leading-none">{value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground mt-1.5">{label}</p>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const contentResults = useQueries({
    queries: contentStats.map((s) => ({
      queryKey: ["admin-count", s.table],
      queryFn: async () => {
        const { count } = await supabase.from(s.table).select("*", { count: "exact", head: true });
        return count ?? 0;
      },
    })),
  });
  const contentCounts = contentStats.map((s, i) => ({ ...s, count: contentResults[i].data ?? 0 }));

  const { data: pendingMemberships = 0 } = useQuery({
    queryKey: ["admin-count", "membership_signups", "pending"],
    queryFn: async () => {
      const { count } = await supabase.from("membership_signups").select("*", { count: "exact", head: true }).eq("status", "pending");
      return count ?? 0;
    },
  });

  const { data: pendingVolunteers = 0 } = useQuery({
    queryKey: ["admin-count", "volunteer_applications", "pending"],
    queryFn: async () => {
      const { count } = await supabase.from("volunteer_applications").select("*", { count: "exact", head: true }).eq("status", "pending");
      return count ?? 0;
    },
  });

  const { data: unreadMessages = 0 } = useQuery({
    queryKey: ["admin-count", "contact_messages", "unread"],
    queryFn: async () => {
      const { count } = await supabase.from("contact_messages").select("*", { count: "exact", head: true }).is("read_at", null);
      return count ?? 0;
    },
  });

  const { data: donationsCount = 0 } = useQuery({
    queryKey: ["admin-count", "donations"],
    queryFn: async () => {
      const { count } = await supabase.from("donations").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useQuery({
    queryKey: ["analytics-summary"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_analytics_summary");
      if (error) throw error;
      return data as unknown as AnalyticsSummary;
    },
  });

  const hasAnalytics = !analyticsLoading && !analyticsError && analytics;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground mt-1">Vue d'ensemble de l'activité du site.</p>
      </div>

      {/* Attention needed */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <HeroStat icon={UserPlus} label="Adhésions en attente" value={pendingMemberships} color="amber" />
        <HeroStat icon={Briefcase} label="Candidatures en attente" value={pendingVolunteers} color="violet" />
        <HeroStat icon={Mail} label="Messages non lus" value={unreadMessages} color="rose" />
        <HeroStat icon={HeartHandshake} label="Dons enregistrés" value={donationsCount} color="emerald" />
      </div>

      {/* Visitor stats */}
      {hasAnalytics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <HeroStat icon={Eye} label="Visites aujourd'hui" value={analytics.today} color="sky" />
          <HeroStat icon={Eye} label="Cette semaine" value={analytics.this_week} color="sky" />
          <HeroStat icon={Eye} label="Ce mois" value={analytics.this_month} color="sky" />
          <HeroStat icon={Eye} label="Total" value={analytics.total} color="sky" />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Visitors chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-accent" />
            <h3 className="font-semibold text-foreground">Visiteurs — 30 derniers jours</h3>
          </div>
          {analyticsLoading ? (
            <p className="text-sm text-muted-foreground py-16 text-center">Chargement...</p>
          ) : !hasAnalytics ? (
            <p className="text-sm text-muted-foreground py-16 text-center">
              Les statistiques de visite ne sont pas encore disponibles.
            </p>
          ) : analytics.daily_series.length === 0 ? (
            <p className="text-sm text-muted-foreground py-16 text-center">Pas encore de données.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={analytics.daily_series}>
                <defs>
                  <linearGradient id="dashVisitorsFill" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="visitors" stroke="hsl(var(--accent))" fill="url(#dashVisitorsFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Content breakdown */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-accent" />
            <h3 className="font-semibold text-foreground">Contenu du site</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={contentCounts} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis
                type="category"
                dataKey="label"
                width={90}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {contentCounts.map((_, i) => (
                  <Cell key={i} fill={chartColors[i % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Content counts grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contentCounts.map(({ key, label, icon: Icon, count, color }) => (
          <HeroStat key={key} icon={Icon} label={label} value={count} color={color} />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
