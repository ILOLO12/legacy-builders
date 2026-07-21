import { useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

export interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "checkbox" | "date" | "select" | "image" | "file";
  required?: boolean;
  options?: { value: string; label: string }[];
}

type FieldValue = string | number | boolean | null;
type RowData = Record<string, FieldValue> & { id?: string };

interface CrudTableProps {
  table: keyof Database["public"]["Tables"];
  title: string;
  fields: FieldDef[];
  orderBy?: string;
  /** Extra buttons rendered before Edit/Delete on each row, for table-specific actions. */
  renderRowActions?: (row: RowData) => ReactNode;
}

const CrudTable = ({ table, title, fields, orderBy = "created_at", renderRowActions }: CrudTableProps) => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<RowData | null>(null);
  const [isNew, setIsNew] = useState(false);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order(orderBy, { ascending: true });
      if (error) throw error;
      return data as unknown as RowData[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (row: RowData) => {
      const payload: Record<string, FieldValue> = {};
      fields.forEach((f) => { payload[f.key] = row[f.key] ?? null; });

      if (isNew) {
        const { error } = await supabase.from(table).insert(payload as never);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table).update(payload as never).eq("id", row.id as string);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", table] });
      setEditing(null);
      setIsNew(false);
      toast.success(isNew ? "Créé avec succès" : "Mis à jour avec succès");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", table] });
      toast.success("Supprimé");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const startNew = () => {
    const empty: RowData = {};
    fields.forEach((f) => {
      empty[f.key] = f.type === "checkbox" ? false : f.type === "number" ? 0 : "";
    });
    setEditing(empty);
    setIsNew(true);
  };

  const renderField = (f: FieldDef, value: FieldValue, onChange: (v: FieldValue) => void) => {
    if (f.type === "textarea") {
      return <Textarea value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={f.label} className="text-sm" />;
    }
    if (f.type === "checkbox") {
      return (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="rounded" />
          {f.label}
        </label>
      );
    }
    if (f.type === "select") {
      return (
        <select
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {f.options?.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      );
    }
    if (f.type === "image" || f.type === "file") {
      return <ImageUploadField value={(value as string) ?? ""} onChange={(v) => onChange(v)} kind={f.type} />;
    }
    return (
      <Input
        type={f.type === "number" ? "number" : f.type === "date" ? "datetime-local" : "text"}
        value={(value as string | number) ?? ""}
        onChange={(e) => onChange(f.type === "number" ? Number(e.target.value) : e.target.value)}
        placeholder={f.label}
        className="text-sm"
      />
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-serif font-bold text-foreground">{title}</h1>
        <Button onClick={startNew} className="gap-2 bg-primary">
          <Plus size={16} /> Ajouter
        </Button>
      </div>

      {/* Edit / Create form */}
      {editing && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4">
          <h3 className="font-semibold text-foreground">{isNew ? "Nouveau" : "Modifier"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">{f.label}</label>
                {renderField(f, editing[f.key], (v) => setEditing({ ...editing, [f.key]: v }))}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => saveMutation.mutate(editing)} disabled={saveMutation.isPending} className="gap-2 bg-primary">
              <Save size={14} /> Enregistrer
            </Button>
            <Button variant="outline" onClick={() => { setEditing(null); setIsNew(false); }} className="gap-2">
              <X size={14} /> Annuler
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : rows.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Aucun élément. Cliquez sur « Ajouter » pour commencer.</div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {fields.slice(0, 4).map((f) => (
                    <th key={f.key} className="text-left px-4 py-3 font-medium text-muted-foreground">{f.label}</th>
                  ))}
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    {fields.slice(0, 4).map((f) => (
                      <td key={f.key} className="px-4 py-3 text-foreground max-w-[200px] truncate">
                        {f.type === "checkbox" ? (row[f.key] ? "✓" : "✗") : String(row[f.key] ?? "—")}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right space-x-1">
                      {renderRowActions?.(row)}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setEditing({ ...row }); setIsNew(false); }}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => { if (confirm("Supprimer ?")) deleteMutation.mutate(row.id); }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudTable;
