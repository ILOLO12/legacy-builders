import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Briefcase, Trash2, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const STATUS_OPTIONS = [
  { value: "pending", label: "En attente" },
  { value: "reviewed", label: "Examinée" },
  { value: "contacted", label: "Contacté(e)" },
  { value: "rejected", label: "Refusée" },
];

const AdminVolunteerApplications = () => {
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["volunteer_applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("volunteer_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("volunteer_applications").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteer_applications"] });
      toast.success("Statut mis à jour");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("volunteer_applications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteer_applications"] });
      toast.success("Supprimée");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Candidatures Volontariat</h1>
        <p className="text-sm text-muted-foreground mt-1">Candidatures envoyées depuis la page publique Volontariat.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Aucune candidature pour le moment.</div>
      ) : (
        <div className="space-y-3">
          {applications.map((a) => (
            <div key={a.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
              <Briefcase size={16} className="text-primary mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-semibold text-sm text-foreground">{a.applicant_name}</p>
                  <a href={`mailto:${a.applicant_email}`} className="text-xs text-accent hover:underline">{a.applicant_email}</a>
                  {a.applicant_phone && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone size={11} /> {a.applicant_phone}
                    </span>
                  )}
                  <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
                    {a.position_title ?? "Candidature spontanée"}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(a.created_at).toLocaleString("fr-FR")}
                  </span>
                </div>
                {a.message && <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">{a.message}</p>}
              </div>
              <select
                value={a.status}
                onChange={(e) => statusMutation.mutate({ id: a.id, status: e.target.value })}
                className="text-xs border border-border rounded-md px-2 py-1.5 bg-background flex-shrink-0"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <Button size="sm" variant="ghost" className="text-destructive flex-shrink-0" onClick={() => deleteMutation.mutate(a.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVolunteerApplications;
