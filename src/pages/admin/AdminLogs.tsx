import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertTriangle, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminLogs = () => {
  const queryClient = useQueryClient();

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["error_logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("error_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("error_logs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["error_logs"] });
      toast.success("Entrée supprimée");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Journal d'erreurs</h1>
        <p className="text-sm text-muted-foreground mt-1">Erreurs signalées par l'assistant virtuel et la publication vers les réseaux sociaux (100 plus récentes).</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Aucune erreur enregistrée.</div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle size={16} className="text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{log.source}</code>
                  <span className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString("fr-FR")}</span>
                </div>
                <p className="text-sm text-foreground">{log.message}</p>
                {log.context && (
                  <pre className="text-xs text-muted-foreground mt-1 overflow-x-auto">{JSON.stringify(log.context, null, 2)}</pre>
                )}
              </div>
              <Button size="sm" variant="ghost" className="text-destructive flex-shrink-0" onClick={() => deleteMutation.mutate(log.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLogs;
