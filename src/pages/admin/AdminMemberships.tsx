import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Users, Trash2, FileText, Loader2, Globe2, Briefcase, Linkedin, Phone, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getMembershipCVUrl } from "@/lib/mediaStorage";

const STATUS_OPTIONS = [
  { value: "pending", label: "En attente" },
  { value: "approved", label: "Acceptée" },
  { value: "rejected", label: "Refusée" },
];

const AdminMemberships = () => {
  const queryClient = useQueryClient();
  const [openingCv, setOpeningCv] = useState<string | null>(null);

  const { data: signups = [], isLoading } = useQuery({
    queryKey: ["membership_signups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("membership_signups")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status, name, email }: { id: string; status: string; name: string; email: string }) => {
      const { error } = await supabase.from("membership_signups").update({ status }).eq("id", id);
      if (error) throw error;
      if (status === "approved" || status === "rejected") {
        await supabase.functions.invoke("send-membership-status", { body: { name, email, status } }).catch(() => {});
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership_signups"] });
      toast.success("Statut mis à jour");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("membership_signups").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership_signups"] });
      toast.success("Demande supprimée");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openCv = async (path: string) => {
    setOpeningCv(path);
    try {
      const url = await getMembershipCVUrl(path);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Impossible d'ouvrir le CV.");
    } finally {
      setOpeningCv(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Demandes d'adhésion</h1>
        <p className="text-sm text-muted-foreground mt-1">Demandes envoyées depuis la page Adhésion du site.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : signups.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Aucune demande d'adhésion pour le moment.</div>
      ) : (
        <div className="space-y-3">
          {signups.map((s) => (
            <div key={s.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Users size={16} className="text-primary mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-sm text-foreground">{s.name}</p>
                    <a href={`mailto:${s.email}`} className="text-xs text-accent hover:underline">{s.email}</a>
                    <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">{s.tier}</span>
                    {s.occupation && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <Briefcase size={10} /> {s.occupation}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(s.created_at).toLocaleString("fr-FR")}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-2">
                    {s.phone && <span className="flex items-center gap-1"><Phone size={11} /> {s.phone}</span>}
                    {s.country && <span className="flex items-center gap-1"><Globe2 size={11} /> {s.country}</span>}
                    {s.organization && <span className="flex items-center gap-1"><Building2 size={11} /> {s.organization}</span>}
                    {s.linkedin_url && (
                      <a href={s.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-accent hover:underline">
                        <Linkedin size={11} /> LinkedIn
                      </a>
                    )}
                    {s.expertise_field && <span>Expertise : {s.expertise_field}</span>}
                  </div>

                  {s.message && <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">{s.message}</p>}

                  {s.cv_url && (
                    <button
                      onClick={() => openCv(s.cv_url!)}
                      disabled={openingCv === s.cv_url}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
                    >
                      {openingCv === s.cv_url ? <Loader2 size={12} className="animate-spin" /> : <FileText size={12} />}
                      Voir le CV
                    </button>
                  )}
                </div>

                <select
                  value={s.status}
                  onChange={(e) => statusMutation.mutate({ id: s.id, status: e.target.value, name: s.name, email: s.email })}
                  className="text-xs border border-border rounded-md px-2 py-1.5 bg-background flex-shrink-0"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <Button size="sm" variant="ghost" className="text-destructive flex-shrink-0" onClick={() => deleteMutation.mutate(s.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMemberships;
