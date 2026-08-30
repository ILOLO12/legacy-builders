import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { HeartHandshake, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const METHOD_LABELS: Record<string, string> = {
  bank_transfer: "Virement bancaire",
  mobile_money: "Mobile Money",
  paypal: "PayPal",
  zelle: "Zelle",
  other: "Autre",
};

const STATUS_OPTIONS = [
  { value: "pending", label: "En attente" },
  { value: "received", label: "Reçu" },
  { value: "cancelled", label: "Annulé" },
];

const AdminDonations = () => {
  const queryClient = useQueryClient();

  const { data: donations = [], isLoading } = useQuery({
    queryKey: ["donations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("donations").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      toast.success("Statut mis à jour");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("donations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      toast.success("Supprimé");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const total = donations.filter((d) => d.status === "received").reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Dons</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Intentions de don envoyées depuis la page "Faire un don". Ceci n'est pas un système de paiement en ligne —
          aucune plateforme (PayPal, Zelle, M-Pesa...) n'est encore connectée. Chaque ligne est une promesse de don à
          suivre manuellement ; passe le statut à "Reçu" une fois l'argent effectivement reçu.
        </p>
        {donations.length > 0 && (
          <p className="text-sm font-semibold text-accent mt-2">Total reçu confirmé : {total.toLocaleString()} $</p>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : donations.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Aucun don pour le moment.</div>
      ) : (
        <div className="space-y-3">
          {donations.map((d) => (
            <div key={d.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
              <HeartHandshake size={16} className="text-primary mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-semibold text-sm text-foreground">{d.donor_name}</p>
                  <a href={`mailto:${d.donor_email}`} className="text-xs text-accent hover:underline">{d.donor_email}</a>
                  <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
                    {d.amount.toLocaleString()} {d.currency}
                  </span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-medium">
                    {METHOD_LABELS[d.method] ?? d.method}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(d.created_at).toLocaleString("fr-FR")}
                  </span>
                </div>
                {d.message && <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">{d.message}</p>}
              </div>
              <select
                value={d.status}
                onChange={(e) => statusMutation.mutate({ id: d.id, status: e.target.value })}
                className="text-xs border border-border rounded-md px-2 py-1.5 bg-background flex-shrink-0"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <Button size="sm" variant="ghost" className="text-destructive flex-shrink-0" onClick={() => deleteMutation.mutate(d.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDonations;
