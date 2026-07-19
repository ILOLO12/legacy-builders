import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Plus, Trash2 } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { SITE_SETTINGS_DEFAULTS } from "@/hooks/useSiteSettings";

const IDENTITY_FIELDS: { key: keyof typeof SITE_SETTINGS_DEFAULTS; label: string; kind?: "image" }[] = [
  { key: "site_name", label: "Nom de l'organisation" },
  { key: "site_tagline", label: "Slogan / sous-titre" },
  { key: "logo_url", label: "Logo", kind: "image" },
  { key: "contact_email", label: "Email de contact" },
  { key: "contact_phone", label: "Téléphone de contact" },
  { key: "footer_hq_text", label: "Texte du siège (pied de page)" },
  { key: "footer_regions_text", label: "Régions représentées (pied de page)" },
  { key: "social_facebook", label: "Lien Facebook" },
  { key: "social_twitter", label: "Lien Twitter / X" },
  { key: "social_instagram", label: "Lien Instagram" },
  { key: "social_linkedin", label: "Lien LinkedIn" },
  { key: "social_youtube", label: "Lien YouTube" },
];

const AdminSettings = () => {
  const queryClient = useQueryClient();
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [identity, setIdentity] = useState<Record<string, string>>({ ...SITE_SETTINGS_DEFAULTS });

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["admin", "site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").order("key");
      if (error) throw error;
      return data as { id: string; key: string; value: string | null }[];
    },
  });

  useEffect(() => {
    if (!settings.length) return;
    setIdentity((prev) => {
      const next = { ...prev };
      for (const s of settings) {
        if (s.key in SITE_SETTINGS_DEFAULTS) next[s.key] = s.value ?? "";
      }
      return next;
    });
  }, [settings]);

  const saveIdentityMutation = useMutation({
    mutationFn: async () => {
      const rows = IDENTITY_FIELDS.map((f) => ({ key: f.key, value: identity[f.key] ?? "" }));
      const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "site_settings"] });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Identité du site mise à jour");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: string }) => {
      const { error } = await supabase.from("site_settings").update({ value, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "site_settings"] });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
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

  const knownKeys = new Set(IDENTITY_FIELDS.map((f) => f.key as string));
  const otherSettings = settings.filter((s) => !knownKeys.has(s.key));

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Paramètres du site</h1>

      {/* Site identity */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-foreground mb-1">Identité du site</h3>
        <p className="text-xs text-muted-foreground mb-4">Logo, nom, contact et réseaux sociaux affichés sur tout le site.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {IDENTITY_FIELDS.map((f) => (
            <div key={f.key} className={f.kind === "image" ? "sm:col-span-2" : ""}>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">{f.label}</label>
              {f.kind === "image" ? (
                <ImageUploadField value={identity[f.key] ?? ""} onChange={(v) => setIdentity((d) => ({ ...d, [f.key]: v }))} kind="image" />
              ) : (
                <Input value={identity[f.key] ?? ""} onChange={(e) => setIdentity((d) => ({ ...d, [f.key]: e.target.value }))} className="text-sm" />
              )}
            </div>
          ))}
        </div>
        <Button onClick={() => saveIdentityMutation.mutate()} disabled={saveIdentityMutation.isPending} className="gap-2 bg-primary mt-4">
          <Save size={14} /> Enregistrer l'identité du site
        </Button>
      </div>

      {/* Add new (advanced) */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-foreground mb-4">Paramètre avancé (clé/valeur libre)</h3>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Clé</label>
            <Input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="ma_cle" />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Valeur</label>
            <Input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="valeur" />
          </div>
          <Button onClick={() => addMutation.mutate()} disabled={addMutation.isPending} className="gap-2 bg-primary">
            <Plus size={14} /> Ajouter
          </Button>
        </div>
      </div>

      {/* List of other settings */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : otherSettings.length > 0 ? (
        <div className="space-y-3">
          {otherSettings.map((s) => (
            <SettingRow key={s.id} setting={s} onSave={(v) => updateMutation.mutate({ id: s.id, value: v })} onDelete={() => { if (confirm("Supprimer ?")) deleteMutation.mutate(s.id); }} />
          ))}
        </div>
      ) : null}
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
