import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminMessages = () => {
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["contact_messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
      toast.success("Message supprimé");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Messages de contact</h1>
        <p className="text-sm text-muted-foreground mt-1">Messages envoyés depuis le formulaire de contact du site.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Aucun message reçu pour le moment.</div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
              <Mail size={16} className="text-primary mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-semibold text-sm text-foreground">{m.name}</p>
                  <a href={`mailto:${m.email}`} className="text-xs text-accent hover:underline">{m.email}</a>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(m.created_at).toLocaleString("fr-FR")}
                  </span>
                </div>
                {m.subject && <p className="text-sm font-medium text-foreground mb-1">{m.subject}</p>}
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{m.message}</p>
              </div>
              <Button size="sm" variant="ghost" className="text-destructive flex-shrink-0" onClick={() => deleteMutation.mutate(m.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
