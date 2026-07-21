import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Loader2, FileText } from "lucide-react";
import { uploadMedia } from "@/lib/mediaStorage";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  kind?: "image" | "file";
}

const isImageUrl = (url: string) => /\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i.test(url);

const ImageUploadField = ({ value, onChange, kind = "image" }: ImageUploadFieldProps) => {
  const [stage, setStage] = useState<"idle" | "optimizing" | "uploading">("idle");
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const accept = kind === "file" ? "image/*,video/*,application/pdf" : "image/*";
  const uploading = stage !== "idle";

  const handleFile = async (file: File) => {
    setStage(file.type.startsWith("image/") ? "optimizing" : "uploading");
    setProgress(0);
    try {
      const url = await uploadMedia(file, {
        onProgress: (p) => { setStage("uploading"); setProgress(p); },
      });
      onChange(url);
      toast.success("Fichier téléversé");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec du téléversement");
    } finally {
      setStage("idle");
      setProgress(0);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {value && isImageUrl(value) ? (
          <img src={value} alt="" className="w-10 h-10 rounded object-cover border border-border flex-shrink-0" />
        ) : value ? (
          <div className="w-10 h-10 rounded border border-border flex items-center justify-center flex-shrink-0 bg-muted">
            <FileText size={16} className="text-muted-foreground" />
          </div>
        ) : null}
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="URL du fichier" className="text-sm flex-1" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="gap-1.5 flex-shrink-0"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {stage === "optimizing" ? "Optimisation..." : stage === "uploading" ? `${progress}%` : "Téléverser"}
        </Button>
      </div>
      {stage === "uploading" && (
        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
};

export default ImageUploadField;
