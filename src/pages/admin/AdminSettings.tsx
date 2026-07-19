import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Plus, Trash2 } from "lucide-react";

const AdminSettings = () => {
  const queryClient = useQueryClient();
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["admin", "site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").order("key");
      if (error) throw error;
      return data as { id: string; key: string; value: string | null }[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: string }) => {
      const { error } = await supabase.from("site_settings").update({ value, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "site_settings"] });
      toast.success("Paramètre mis à jour");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!newKey.trim()) throw new Error("Clé requise");
      const { error } = await supabase.from("site_settings").insert({ key: newKey.trim(), value: newValue });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "site_settings"] });
      setNewKey("");
      setNewValue("");
      toast.success("Paramètre ajouté");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("site_settings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "site_settings"] });
      toast.success("Supprimé");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Paramètres du site</h1>

      {/* Add new */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-foreground mb-4">Ajouter un paramètre</h3>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Clé</label>
            <Input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="site_name" />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Valeur</label>
            <Input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="MUFO" />
          </div>
          <Button onClick={() => addMutation.mutate()} disabled={addMutation.isPending} className="gap-2 bg-primary">
            <Plus size={14} /> Ajouter
          </Button>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : (
        <div className="space-y-3">
          {settings.map((s) => (
            <SettingRow key={s.id} setting={s} onSave={(v) => updateMutation.mutate({ id: s.id, value: v })} onDelete={() => { if (confirm("Supprimer ?")) deleteMutation.mutate(s.id); }} />
          ))}
        </div>
      )}
    </div>
  );
};

const SettingRow = ({ setting, onSave, onDelete }: { setting: { id: string; key: string; value: string | null }; onSave: (v: string) => void; onDelete: () => void }) => {
  const [value, setValue] = useState(setting.value ?? "");
  const changed = value !== (setting.value ?? "");

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex gap-3 items-center">
      <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-foreground min-w-[120px]">{setting.key}</code>
      <Textarea value={value} onChange={(e) => setValue(e.target.value)} className="flex-1 text-sm min-h-[38px] resize-none" rows={1} />
      {changed && (
        <Button size="sm" onClick={() => onSave(value)} className="gap-1 bg-primary">
          <Save size={12} /> Sauver
        </Button>
      )}
      <Button size="sm" variant="ghost" className="text-destructive" onClick={onDelete}>
        <Trash2 size={14} />
      </Button>
    </div>
  );
};

export default AdminSettings;
