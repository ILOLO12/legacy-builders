import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, FileText } from "lucide-react";
import { PAGE_SCHEMAS, getPageSchema } from "@/lib/pageSchemas";
import { en } from "@/i18n/en";
import { fr } from "@/i18n/fr";
import type { Json } from "@/integrations/supabase/types";

type LangContent = Record<string, string>;
type PageContent = { fr?: LangContent; en?: LangContent };

const AdminPages = () => {
  const qc = useQueryClient();
  const [activeSlug, setActiveSlug] = useState(PAGE_SCHEMAS[0].slug);
  const schema = getPageSchema(activeSlug)!;
  const [draft, setDraft] = useState<PageContent>({ fr: {}, en: {} });

  const { data: row } = useQuery({
    queryKey: ["admin-page", activeSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("id, slug, content")
        .eq("slug", activeSlug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const c = (row?.content as PageContent) ?? {};
    setDraft({ fr: { ...(c.fr ?? {}) }, en: { ...(c.en ?? {}) } });
  }, [row, activeSlug]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("pages")
        .upsert({ slug: activeSlug, content: draft as Json, updated_at: new Date().toISOString() }, { onConflict: "slug" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-page", activeSlug] });
      qc.invalidateQueries({ queryKey: ["page-content", activeSlug] });
      toast.success("Page enregistrée");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const translations = { fr, en } as unknown as Record<"fr" | "en", Record<string, Record<string, string>>>;
  const frTrans = translations.fr[schema.translationKey];
  const enTrans = translations.en[schema.translationKey];

  const setField = (lang: "fr" | "en", key: string, value: string) =>
    setDraft((d) => ({ ...d, [lang]: { ...(d[lang] ?? {}), [key]: value } }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-foreground">Pages du site</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Modifiez le contenu de chaque page en français et en anglais. Laissez un champ vide pour garder le texte par défaut.
        </p>
      </div>

      {/* Page selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {PAGE_SCHEMAS.map((p) => (
          <button
            key={p.slug}
            onClick={() => setActiveSlug(p.slug)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeSlug === p.slug
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border hover:bg-muted"
            }`}
          >
            <FileText size={14} />
            {p.label}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        {schema.fields.map((f) => {
          const InputComp = f.multiline ? Textarea : Input;
          return (
            <div key={f.key} className="grid md:grid-cols-2 gap-4 pb-6 border-b border-border last:border-0 last:pb-0">
              <div>
                <label className="text-xs font-semibold text-accent uppercase tracking-wider mb-1 block">
                  {f.label} <span className="text-muted-foreground normal-case font-normal">(FR)</span>
                </label>
                <InputComp
                  value={draft.fr?.[f.key] ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setField("fr", f.key, e.target.value)}
                  placeholder={frTrans?.[f.key] ?? ""}
                  className="text-sm"
                  rows={f.multiline ? 3 : undefined}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-accent uppercase tracking-wider mb-1 block">
                  {f.label} <span className="text-muted-foreground normal-case font-normal">(EN)</span>
                </label>
                <InputComp
                  value={draft.en?.[f.key] ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setField("en", f.key, e.target.value)}
                  placeholder={enTrans?.[f.key] ?? ""}
                  className="text-sm"
                  rows={f.multiline ? 3 : undefined}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-4 mt-6 flex justify-end">
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="gap-2 bg-primary shadow-lg"
          size="lg"
        >
          <Save size={16} />
          {saveMutation.isPending ? "Enregistrement..." : "Enregistrer la page"}
        </Button>
      </div>
    </div>
  );
};

export default AdminPages;
