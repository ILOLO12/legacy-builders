import { useQuery } from "@tanstack/react-query";
import { Facebook, Instagram, Linkedin, Twitter, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PLATFORM_INFO: Record<string, { label: string; icon: typeof Facebook; secret: string }> = {
  facebook: { label: "Facebook", icon: Facebook, secret: "FACEBOOK_PAGE_TOKEN" },
  instagram: { label: "Instagram", icon: Instagram, secret: "INSTAGRAM_ACCESS_TOKEN" },
  linkedin: { label: "LinkedIn", icon: Linkedin, secret: "LINKEDIN_ACCESS_TOKEN" },
  twitter: { label: "X / Twitter", icon: Twitter, secret: "TWITTER_BEARER_TOKEN" },
};

const AdminSocialMedia = () => {
  const { data: accounts = [] } = useQuery({
    queryKey: ["social_accounts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("social_accounts").select("*").order("platform");
      if (error) throw error;
      return data;
    },
  });

  const { data: logs = [] } = useQuery({
    queryKey: ["social_publish_log"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_publish_log")
        .select("*, articles(title)")
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Réseaux sociaux</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Publiez automatiquement vos actualités sur les réseaux sociaux connectés. Chaque plateforme s'active en ajoutant sa clé API dans Cloud → Secrets.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {accounts.map((acc) => {
          const info = PLATFORM_INFO[acc.platform];
          if (!info) return null;
          return (
            <div key={acc.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <info.icon size={22} className="text-primary" />
                {acc.is_configured ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <CheckCircle2 size={14} /> Connecté
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <XCircle size={14} /> Non configuré
                  </span>
                )}
              </div>
              <p className="font-semibold text-foreground text-sm">{info.label}</p>
              {!acc.is_configured && (
                <p className="text-xs text-muted-foreground mt-1">
                  Ajoutez le secret <code className="bg-muted px-1 rounded">{info.secret}</code> pour l'activer.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground text-sm">Historique des publications</h3>
        </div>
        {logs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Aucune publication pour le moment. Utilisez « Publier sur les réseaux » depuis un article dans Admin → Articles.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Article</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Plateforme</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Statut</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Message</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 text-foreground max-w-[200px] truncate">
                      {(log.articles as { title: string } | null)?.title ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-foreground capitalize">{log.platform}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        log.status === "success" ? "bg-emerald-100 text-emerald-700" :
                        log.status === "failed" ? "bg-destructive/10 text-destructive" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[280px] truncate" title={log.error_message ?? ""}>
                      {log.error_message ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSocialMedia;
