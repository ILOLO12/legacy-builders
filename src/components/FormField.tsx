import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface FormFieldProps {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}

/** Labeled wrapper for public-facing form inputs (Contact, Membership signup). */
const FormField = ({ icon: Icon, label, children }: FormFieldProps) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wide mb-2">
      <Icon size={13} className="text-accent" />
      {label}
    </label>
    {children}
  </div>
);

export default FormField;

export const fieldInputClass =
  "rounded-xl border-2 border-border bg-surface/60 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25 focus-visible:ring-offset-0 transition-colors";
