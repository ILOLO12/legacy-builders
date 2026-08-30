import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Save, Mail, Phone } from "lucide-react";
import { SITE_SETTINGS_DEFAULTS } from "@/hooks/useSiteSettings";

const FIELDS = [
  { key: "contact_email" as const, label: "Email de contact", icon: Mail },
  { key: "contact_phone" as const, label: "Téléphone de contact", icon: Phone },
];

const AdminContactInfo = () => {
  const queryClient = useQueryClient();
  const [values, setValues] = useState({ contact_email: "", contact_phone: "" });

  const { data: settings = [] } = useQuery({
    queryKey: ["admin", "contact_info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key,value")
        .in("key", ["contact_email", "contact_phone"]);
      if (error) throw error;
      return data as { key: string; value: string | null }[];
    },
  });

  useEffect(() => {
    if (!settings.length) return;
    setValues((prev) => {
      const next = { ...prev };
      for (const s of settings) {
        if (s.key === "contact_email" || s.key === "contact_phone") next[s.key] = s.value ?? "";
      }
      return next;
    });
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const rows = FIELDS.map((f) => ({ key: f.key, value: values[f.key] || SITE_SETTINGS_DEFAULTS[f.key] }));
      const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "contact_info"] });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Coordonnées mises à jour");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Coordonnées de contact</h1>
      <p className="text-sm text-muted-foreground mb-8">Email et téléphone affichés sur la page Contact du site.</p>

      <div className="bg-card border border-border rounded-xl p-6 max-w-xl">
        <div className="space-y-4">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                <f.icon size={13} /> {f.label}
              </label>
              <Input
                value={values[f.key]}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                className="text-sm"
              />
            </div>
          ))}
        </div>
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="gap-2 bg-primary mt-6">
          <Save size={14} /> Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default AdminContactInfo;
