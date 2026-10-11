import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AnimatedSection from "@/components/AnimatedSection";
import FormField, { fieldInputClass } from "@/components/FormField";
import Honeypot from "@/components/Honeypot";
import {
  Check, User, Mail, MessageSquare, Send, Briefcase, Globe2, Building2,
  Linkedin, Phone, GraduationCap, FileText, Upload, Loader2, X, ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { usePageContent } from "@/hooks/usePageContent";
import { supabase } from "@/integrations/supabase/client";
import { uploadMembershipCV } from "@/lib/mediaStorage";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  organization: "",
  occupation: "",
  expertiseField: "",
  linkedin: "",
  message: "",
};

const Membership = () => {
  const { t, lang } = useLanguage();
  useSEO("Membership", "Become a member of Muller's Foundation (MUFO) and join our mission.");
  const { benefits: b, ...flat } = t.membership;
  const c = usePageContent("membership", {
    ...flat,
    benefit_quarterly: b.quarterly,
    benefit_annual: b.annual,
    benefit_invitation: b.invitation,
    benefit_certificate: b.certificate,
    benefit_priority: b.priority,
    benefit_recognition: b.recognition,
    benefit_directUpdates: b.directUpdates,
    benefit_exclusiveWebinars: b.exclusiveWebinars,
    benefit_advisory: b.advisory,
    benefit_fieldVisit: b.fieldVisit,
    benefit_dashboard: b.dashboard,
    benefit_vip: b.vip,
    benefit_coBranding: b.coBranding,
  });

  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUploadPct, setCvUploadPct] = useState(0);
  const [sending, setSending] = useState(false);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const tiers = [
    {
      name: c.standard,
      desc: c.standardDesc,
      benefits: [c.benefit_quarterly, c.benefit_annual, c.benefit_invitation, c.benefit_certificate],
      featured: false,
    },
    {
      name: c.supporter,
      desc: c.supporterDesc,
      benefits: [c.benefit_quarterly, c.benefit_annual, c.benefit_invitation, c.benefit_certificate, c.benefit_priority, c.benefit_recognition, c.benefit_directUpdates, c.benefit_exclusiveWebinars],
      featured: true,
    },
    {
      name: c.ambassador,
      desc: c.ambassadorDesc,
      benefits: [c.benefit_quarterly, c.benefit_annual, c.benefit_invitation, c.benefit_certificate, c.benefit_priority, c.benefit_recognition, c.benefit_directUpdates, c.benefit_exclusiveWebinars, c.benefit_advisory, c.benefit_fieldVisit, c.benefit_dashboard, c.benefit_vip, c.benefit_coBranding],
      featured: false,
    },
  ];

  const closeDialog = () => {
    setSelectedTier(null);
    setForm(emptyForm);
    setTermsAccepted(false);
    setHoneypot("");
    setCvFile(null);
    setCvUploadPct(0);
  };

  const handleCvPick = (file: File | undefined) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error(lang === "fr" ? "Le CV doit être un fichier PDF." : "The CV must be a PDF file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(lang === "fr" ? "Le CV ne doit pas dépasser 5 Mo." : "The CV must not exceed 5 MB.");
      return;
    }
    setCvFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bot caught the decoy field — pretend success, insert nothing.
    if (honeypot.trim() !== "") {
      toast.success(lang === "fr" ? "Merci ! Votre demande d'adhésion a bien été envoyée." : "Thank you! Your membership request has been sent.");
      closeDialog();
      return;
    }

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.occupation.trim() || !form.message.trim() || !selectedTier) {
      toast.error(lang === "fr" ? "Merci de remplir tous les champs obligatoires." : "Please fill in all required fields.");
      return;
    }
    if (!termsAccepted) {
      toast.error(lang === "fr" ? "Merci d'accepter les conditions d'adhésion." : "Please accept the membership terms.");
      return;
    }

    setSending(true);

    let cvUrl: string | null = null;
    if (cvFile) {
      try {
        cvUrl = await uploadMembershipCV(cvFile, setCvUploadPct);
      } catch (err) {
        setSending(false);
        toast.error(err instanceof Error ? err.message : (lang === "fr" ? "Échec de l'envoi du CV." : "CV upload failed."));
        return;
      }
    }

    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`;
    const { error } = await supabase.from("membership_signups").insert({
      name: fullName,
      email: form.email.trim(),
      tier: selectedTier,
      occupation: form.occupation.trim(),
      phone: form.phone.trim() || null,
      country: form.country.trim() || null,
      organization: form.organization.trim() || null,
      expertise_field: form.expertiseField.trim() || null,
      linkedin_url: form.linkedin.trim() || null,
      cv_url: cvUrl,
      terms_accepted: termsAccepted,
      message: form.message.trim(),
    });
    setSending(false);
    if (error) {
      toast.error(lang === "fr" ? "Une erreur est survenue. Réessayez." : "Something went wrong. Please try again.");
      return;
    }
    toast.success(lang === "fr" ? "Merci ! Votre demande d'adhésion a bien été envoyée." : "Thank you! Your membership request has been sent.");
    supabase.functions.invoke("send-membership-confirmation", {
      body: { name: fullName, email: form.email.trim(), tier: selectedTier },
    }).catch(() => {});
    closeDialog();
  };

  return (
    <div>
      <section className="page-hero">
        <div className="section-container">
          <h1 className="page-hero-title">{c.title}</h1>
          <div className="gold-line mt-6" />
          <p className="page-hero-subtitle mt-6">{c.subtitle}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="section-container">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {tiers.map((tier, i) => (
              <AnimatedSection key={tier.name} delay={i * 0.15}>
                <div className={`rounded-xl p-8 h-full flex flex-col transition-all duration-300 ${
                  tier.featured
                    ? "bg-primary text-primary-foreground ring-2 ring-accent shadow-2xl scale-[1.03]"
                    : "bg-card border border-border hover:shadow-lg"
                }`}>
                  {tier.featured && (
                    <span className="text-xs font-bold bg-accent text-accent-foreground px-3 py-1 rounded-full self-start mb-4">
                      {c.mostPopular}
                    </span>
                  )}
                  <h3 className="text-xl font-serif font-bold mb-2">{tier.name}</h3>
                  <p className={`text-sm mb-6 ${tier.featured ? "opacity-80" : "text-muted-foreground"}`}>{tier.desc}</p>
                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-sm">
                        <Check size={16} className={`mt-0.5 flex-shrink-0 ${tier.featured ? "text-accent" : "text-primary"}`} />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={tier.featured ? "gold" : "default"}
                    className="w-full"
                    onClick={() => setSelectedTier(tier.name)}
                  >
                    {c.joinNow}
                  </Button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={selectedTier !== null} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          <div className="h-1.5 bg-gradient-to-r from-gold-dark via-accent to-gold-light rounded-t-lg" />
          <div className="p-6 sm:p-8">
            <DialogHeader className="mb-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent to-gold-dark shadow-md shadow-accent/20 flex items-center justify-center flex-shrink-0">
                  <Check className="text-white" size={18} strokeWidth={1.75} />
                </div>
                <div className="text-left">
                  <DialogTitle className="font-serif text-xl">{c.joinNow}</DialogTitle>
                  <p className="text-xs text-accent font-semibold uppercase tracking-wide mt-0.5">{selectedTier}</p>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Honeypot value={honeypot} onChange={setHoneypot} />

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField icon={User} label={lang === "fr" ? "Prénom *" : "First name *"}>
                  <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} maxLength={60} className={fieldInputClass} />
                </FormField>
                <FormField icon={User} label={lang === "fr" ? "Nom *" : "Last name *"}>
                  <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} maxLength={60} className={fieldInputClass} />
                </FormField>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField icon={Mail} label={lang === "fr" ? "Adresse e-mail *" : "Email address *"}>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} className={fieldInputClass} />
                </FormField>
                <FormField icon={Phone} label={lang === "fr" ? "Téléphone" : "Phone"}>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={30} className={fieldInputClass} />
                </FormField>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField icon={Globe2} label={lang === "fr" ? "Pays de résidence" : "Country of residence"}>
                  <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} maxLength={80} className={fieldInputClass} />
                </FormField>
                <FormField icon={Building2} label={lang === "fr" ? "Organisation" : "Organization"}>
                  <Input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} maxLength={100} className={fieldInputClass} />
                </FormField>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField icon={Briefcase} label={lang === "fr" ? "Poste / profession *" : "Occupation *"}>
                  <Input value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} maxLength={100} className={fieldInputClass} />
                </FormField>
                <FormField icon={GraduationCap} label={lang === "fr" ? "Domaine d'expertise" : "Field of expertise"}>
                  <Input value={form.expertiseField} onChange={(e) => setForm({ ...form, expertiseField: e.target.value })} maxLength={100} className={fieldInputClass} />
                </FormField>
              </div>

              <FormField icon={Linkedin} label={lang === "fr" ? "LinkedIn ou site web" : "LinkedIn or website"}>
                <Input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} maxLength={255} className={fieldInputClass} placeholder="https://" />
              </FormField>

              <FormField icon={MessageSquare} label={lang === "fr" ? "Motivation *" : "Motivation *"}>
                <Textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  maxLength={1000}
                  className={fieldInputClass}
                  placeholder={lang === "fr" ? "Pourquoi souhaitez-vous rejoindre MUFO ?" : "Why would you like to join MUFO?"}
                />
              </FormField>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                  <FileText size={13} className="text-accent" />
                  {lang === "fr" ? "CV (PDF, facultatif)" : "CV (PDF, optional)"}
                </label>
                {cvFile ? (
                  <div className="flex items-center gap-2 rounded-xl border-2 border-border bg-surface/60 px-3 py-2.5 text-sm">
                    <FileText size={16} className="text-accent flex-shrink-0" />
                    <span className="flex-1 truncate">{cvFile.name}</span>
                    {sending && cvUploadPct > 0 && cvUploadPct < 100 && (
                      <span className="text-xs text-muted-foreground">{cvUploadPct}%</span>
                    )}
                    <button type="button" onClick={() => setCvFile(null)} className="text-muted-foreground hover:text-destructive flex-shrink-0">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => cvInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface/40 px-3 py-3 text-sm text-muted-foreground hover:border-accent/50 hover:text-accent transition-colors"
                  >
                    <Upload size={16} />
                    {lang === "fr" ? "Joindre votre CV (PDF, max 5 Mo)" : "Attach your CV (PDF, max 5 MB)"}
                  </button>
                )}
                <input
                  ref={cvInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => { handleCvPick(e.target.files?.[0]); e.target.value = ""; }}
                />
              </div>

              <label className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed cursor-pointer">
                <Checkbox checked={termsAccepted} onCheckedChange={(v) => setTermsAccepted(v === true)} className="mt-0.5" />
                <span className="flex items-start gap-1.5">
                  <ShieldCheck size={14} className="text-accent flex-shrink-0 mt-0.5" />
                  {lang === "fr"
                    ? "J'accepte les conditions d'adhésion et la politique de confidentialité de Muller's Foundation (MUFO). *"
                    : "I accept the membership terms and Muller's Foundation (MUFO) privacy policy. *"}
                </span>
              </label>

              <Button type="submit" variant="gold" className="w-full gap-2" disabled={sending}>
                {sending ? <Loader2 size={16} className="animate-spin" /> : <>{c.joinNow} <Send size={16} /></>}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Membership;
