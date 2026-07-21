import { useState } from "react";
import CrudTable, { FieldDef } from "@/components/admin/CrudTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const fields: FieldDef[] = [
  { key: "title", label: "Titre (EN)", required: true },
  { key: "title_fr", label: "Titre (FR)" },
  { key: "slug", label: "Slug", required: true },
  { key: "excerpt", label: "Extrait (EN)" },
  { key: "excerpt_fr", label: "Extrait (FR)" },
  { key: "content", label: "Contenu (EN)", type: "textarea" },
  { key: "content_fr", label: "Contenu (FR)", type: "textarea" },
  { key: "image_url", label: "Image", type: "image" },
  { key: "published", label: "Publié", type: "checkbox" },
];

const PLATFORMS = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "X / Twitter" },
];

const PublishDialog = ({ articleId, articleTitle, open, onOpenChange }: {
  articleId: string;
  articleTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);

  const toggle = (platform: string) =>
    setSelected((s) => (s.includes(platform) ? s.filter((p) => p !== platform) : [...s, platform]));

  const handlePublish = async () => {
    if (selected.length === 0) return;
    setPublishing(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke("social-publish", {
        body: { article_id: articleId, platforms: selected },
        headers: session.session ? { Authorization: `Bearer ${session.session.access_token}` } : undefined,
      });
      if (error) throw error;
      const results = (data?.results ?? {}) as Record<string, { ok: boolean; error?: string }>;
      const failures = Object.entries(results).filter(([, r]) => !r.ok);
      if (failures.length === 0) {
        toast.success("Publié sur les réseaux sélectionnés");
      } else {
        toast.error(`${failures.length}/${selected.length} publication(s) ont échoué — voir Réseaux sociaux pour le détail`);
      }
      onOpenChange(false);
      setSelected([]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec de la publication");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publier « {articleTitle} » sur les réseaux</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-2">
          {PLATFORMS.map((p) => (
            <label key={p.value} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={selected.includes(p.value)} onChange={() => toggle(p.value)} className="rounded" />
              {p.label}
            </label>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          L'article reste publié sur le site même si une plateforme échoue. Voir Réseaux sociaux pour configurer les comptes non connectés.
        </p>
        <DialogFooter>
          <Button onClick={handlePublish} disabled={publishing || selected.length === 0} className="gap-2 bg-primary">
            {publishing ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} />}
            {publishing ? "Publication..." : "Publier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AdminArticles = () => {
  const [publishTarget, setPublishTarget] = useState<{ id: string; title: string } | null>(null);

  return (
    <>
      <CrudTable
        table="articles"
        title="Articles"
        fields={fields}
        orderBy="created_at"
        renderRowActions={(row) =>
          row.published ? (
            <Button
              key="publish"
              size="sm"
              variant="ghost"
              title="Publier sur les réseaux"
              onClick={() => setPublishTarget({ id: row.id as string, title: (row.title as string) ?? "" })}
            >
              <Share2 size={14} />
            </Button>
          ) : null
        }
      />
      {publishTarget && (
        <PublishDialog
          articleId={publishTarget.id}
          articleTitle={publishTarget.title}
          open={!!publishTarget}
          onOpenChange={(open) => !open && setPublishTarget(null)}
        />
      )}
    </>
  );
};

export default AdminArticles;
