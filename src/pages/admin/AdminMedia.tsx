import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Loader2, Trash2, FileText, Copy } from "lucide-react";
import { listMedia, uploadMedia, deleteMedia, mediaPublicUrl } from "@/lib/mediaStorage";

const isImageFile = (name: string) => /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(name);

const formatSize = (bytes?: number) => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

const AdminMedia = () => {
  const queryClient = useQueryClient();
  const [stage, setStage] = useState<"idle" | "optimizing" | "uploading">("idle");
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploading = stage !== "idle";

  const { data: files = [], isLoading } = useQuery({
    queryKey: ["media-files"],
    queryFn: listMedia,
  });

  const deleteMutation = useMutation({
    mutationFn: (path: string) => deleteMedia(path),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-files"] });
      toast.success("Fichier supprimé");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleUpload = async (file: File) => {
    setStage(file.type.startsWith("image/") ? "optimizing" : "uploading");
    setProgress(0);
    try {
      await uploadMedia(file, { onProgress: (p) => { setStage("uploading"); setProgress(p); } });
      queryClient.invalidateQueries({ queryKey: ["media-files"] });
      toast.success("Fichier téléversé");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec du téléversement");
    } finally {
      setStage("idle");
      setProgress(0);
    }
  };

  const copyUrl = (path: string) => {
    navigator.clipboard.writeText(mediaPublicUrl(path));
    toast.success("URL copiée");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Médiathèque</h1>
          <p className="text-sm text-muted-foreground mt-1">Images, vidéos et PDF utilisables partout sur le site.</p>
        </div>
        <Button onClick={() => inputRef.current?.click()} disabled={uploading} className="gap-2 bg-primary">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {stage === "optimizing" ? "Optimisation..." : stage === "uploading" ? `Téléversement... ${progress}%` : "Téléverser un fichier"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*,application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = "";
          }}
        />
      </div>
      {stage === "uploading" && (
        <div className="h-1 w-full max-w-xs bg-muted rounded-full overflow-hidden mb-6 -mt-4">
          <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : files.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Aucun fichier. Cliquez sur « Téléverser un fichier » pour commencer.</div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((f) => (
            <div key={f.name} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                {isImageFile(f.name) ? (
                  <img src={mediaPublicUrl(f.name)} alt={f.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <FileText size={32} className="text-muted-foreground" />
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-foreground truncate" title={f.name}>{f.name}</p>
                <p className="text-xs text-muted-foreground">{formatSize(f.metadata?.size as number | undefined)}</p>
                <div className="flex gap-1 mt-2">
                  <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => copyUrl(f.name)}>
                    <Copy size={12} /> Copier
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => { if (confirm("Supprimer ce fichier ?")) deleteMutation.mutate(f.name); }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMedia;
