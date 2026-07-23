import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Users, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminMemberships = () => {
  const queryClient = useQueryClient();

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
            <div key={s.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
              <Users size={16} className="text-primary mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-semibold text-sm text-foreground">{s.name}</p>
                  <a href={`mailto:${s.email}`} className="text-xs text-accent hover:underline">{s.email}</a>
                  <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">{s.tier}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(s.created_at).toLocaleString("fr-FR")}
                  </span>
                </div>
                {s.message && <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">{s.message}</p>}
              </div>
              <Button size="sm" variant="ghost" className="text-destructive flex-shrink-0" onClick={() => deleteMutation.mutate(s.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMemberships;
