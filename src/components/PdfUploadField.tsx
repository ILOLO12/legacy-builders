import { useRef } from "react";
import { FileText, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PdfUploadFieldProps {
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  uploading?: boolean;
  uploadPct?: number;
  required?: boolean;
  maxSizeMb?: number;
  lang: "fr" | "en";
}

/** Labeled PDF file picker used for CVs and cover letters across public forms. */
const PdfUploadField = ({
  label,
  file,
  onFileChange,
  uploading = false,
  uploadPct = 0,
  required = false,
  maxSizeMb = 5,
  lang,
}: PdfUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePick = (picked: File | undefined) => {
    if (!picked) return;
    if (picked.type !== "application/pdf") {
      toast.error(lang === "fr" ? "Le fichier doit être un PDF." : "The file must be a PDF.");
      return;
    }
    if (picked.size > maxSizeMb * 1024 * 1024) {
      toast.error(
        lang === "fr" ? `Le fichier ne doit pas dépasser ${maxSizeMb} Mo.` : `The file must not exceed ${maxSizeMb} MB.`
      );
      return;
    }
    onFileChange(picked);
  };

  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wide mb-2">
        <FileText size={13} className="text-accent" />
        {label}
      </label>
      {file ? (
        <div className="flex items-center gap-2 rounded-xl border-2 border-border bg-surface/60 px-3 py-2.5 text-sm">
          <FileText size={16} className="text-accent flex-shrink-0" />
          <span className="flex-1 truncate">{file.name}</span>
          {uploading && uploadPct > 0 && uploadPct < 100 && (
            <span className="text-xs text-muted-foreground">{uploadPct}%</span>
          )}
          <button type="button" onClick={() => onFileChange(null)} className="text-muted-foreground hover:text-destructive flex-shrink-0">
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface/40 px-3 py-3 text-sm text-muted-foreground hover:border-accent/50 hover:text-accent transition-colors"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {lang === "fr"
            ? `${required ? "Joindre (obligatoire)" : "Joindre (facultatif)"} — PDF, max ${maxSizeMb} Mo`
            : `${required ? "Attach (required)" : "Attach (optional)"} — PDF, max ${maxSizeMb} MB`}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => { handlePick(e.target.files?.[0]); e.target.value = ""; }}
      />
    </div>
  );
};

export default PdfUploadField;
