import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase, MapPin, ListChecks, ArrowRight, Megaphone, User, Mail, Send,
  Globe2, GraduationCap, Building2, CalendarClock, Loader2,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FormField, { fieldInputClass } from "@/components/FormField";
import Honeypot from "@/components/Honeypot";
import CountrySelect from "@/components/CountrySelect";
import PhoneInput from "@/components/PhoneInput";
import PdfUploadField from "@/components/PdfUploadField";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/integrations/supabase/client";
import { uploadMembershipCV, uploadMotivationLetter } from "@/lib/mediaStorage";

type VolunteerPosition = {
  id: string;
  title: string;
  title_fr: string | null;
  description: string | null;
  description_fr: string | null;
  criteria: string | null;
  criteria_fr: string | null;
  location: string | null;
};

const Volunteer = () => {
  const { lang } = useLanguage();
  useSEO("Rejoignez notre équipe — Appel à volontariat", "Muller's Foundation (MUFO) recrute des bénévoles à Kinshasa, RDC.");

  const { data: positions = [], isLoading } = useQuery({
    queryKey: ["volunteer_positions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("volunteer_positions")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as VolunteerPosition[];
    },
  });

  const localized = (en: string | null, fr: string | null) => (lang === "fr" && fr ? fr : en ?? "");

  const emptyForm = {
    firstName: "", lastName: "", email: "", phone: "", country: "",
    occupation: "", skills: "", organization: "", availability: "",
  };

  const [applyingTo, setApplyingTo] = useState<{ id: string | null; title: string } | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [sending, setSending] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUploadPct, setCvUploadPct] = useState(0);
  const [letterFile, setLetterFile] = useState<File | null>(null);
  const [letterUploadPct, setLetterUploadPct] = useState(0);

  const closeDialog = () => {
    setApplyingTo(null);
    setForm(emptyForm);
    setHoneypot("");
    setCvFile(null);
    setCvUploadPct(0);
    setLetterFile(null);
    setLetterUploadPct(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot.trim() !== "") {
      toast.success(lang === "fr" ? "Merci ! Votre candidature a bien été envoyée." : "Thank you! Your application has been sent.");
      closeDialog();
      return;
    }
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      toast.error(lang === "fr" ? "Merci de remplir les champs obligatoires." : "Please fill in the required fields.");
      return;
    }
    if (!cvFile) {
      toast.error(lang === "fr" ? "Merci de joindre votre CV." : "Please attach your CV.");
      return;
    }
    if (!letterFile) {
      toast.error(lang === "fr" ? "Merci de joindre votre lettre de motivation." : "Please attach your cover letter.");
      return;
    }
    setSending(true);

    let cvUrl: string;
    try {
      cvUrl = await uploadMembershipCV(cvFile, setCvUploadPct);
    } catch (err) {
      setSending(false);
      toast.error(err instanceof Error ? err.message : (lang === "fr" ? "Échec de l'envoi du CV." : "CV upload failed."));
      return;
    }

    let letterUrl: string;
    try {
      letterUrl = await uploadMotivationLetter(letterFile, setLetterUploadPct);
    } catch (err) {
      setSending(false);
      toast.error(err instanceof Error ? err.message : (lang === "fr" ? "Échec de l'envoi de la lettre." : "Cover letter upload failed."));
      return;
    }

    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`;
    const { error } = await supabase.from("volunteer_applications").insert({
      position_id: applyingTo?.id ?? null,
      position_title: applyingTo?.title ?? null,
      applicant_name: fullName,
      applicant_email: form.email.trim(),
      applicant_phone: form.phone.trim() || null,
      country: form.country.trim() || null,
      occupation: form.occupation.trim() || null,
      skills: form.skills.trim() || null,
      organization: form.organization.trim() || null,
      availability: form.availability.trim() || null,
      cv_url: cvUrl,
      motivation_letter_url: letterUrl,
    });
    setSending(false);
    if (error) {
      toast.error(lang === "fr" ? "Une erreur est survenue. Réessayez." : "Something went wrong. Please try again.");
      return;
    }
    toast.success(
      lang === "fr" ? "Merci ! Votre candidature a bien été envoyée." : "Thank you! Your application has been sent."
    );
    supabase.functions.invoke("send-volunteer-confirmation", {
      body: { name: fullName, email: form.email.trim(), position: applyingTo?.title ?? "" },
    }).catch(() => {});
    closeDialog();
  };

  return (
    <div>
      <section className="navy-section pt-28 pb-16 text-center">
        <div className="section-container">
          <AnimatedSection>
            <Megaphone className="mx-auto text-accent mb-4" size={40} />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground">
              {lang === "fr" ? "Appel à Volontariat" : "Call for Volunteers"}
            </h1>
            <p className="mt-4 text-primary-foreground/70 max-w-2xl mx-auto">
              {lang === "fr"
                ? "Rejoignez notre équipe et donnez du sens à votre engagement en soutenant nos programmes à Kinshasa, RDC."
                : "Join our team and put your commitment to work supporting our programs in Kinshasa, DR Congo."}
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20">
        <div className="section-container max-w-4xl mx-auto">
          {isLoading ? (
            <p className="text-center text-muted-foreground">{lang === "fr" ? "Chargement..." : "Loading..."}</p>
          ) : positions.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {lang === "fr" ? "Aucun poste ouvert pour le moment." : "No open positions at the moment."}
            </p>
          ) : (
            <div className="space-y-6">
              {positions.map((p, i) => (
                <AnimatedSection key={p.id} delay={i * 0.08}>
                  <div className="bg-card border border-border rounded-2xl shadow-md overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-gold-dark via-accent to-gold-light" />
                    <div className="p-6 sm:p-8">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-md flex items-center justify-center flex-shrink-0">
                            <Briefcase className="text-white" size={18} strokeWidth={1.75} />
                          </div>
                          <h2 className="text-lg font-serif font-bold">{localized(p.title, p.title_fr)}</h2>
                        </div>
                        {p.location && (
                          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-surface px-3 py-1.5 rounded-full">
                            <MapPin size={13} /> {p.location}
                          </span>
                        )}
                      </div>

                      {localized(p.description, p.description_fr) && (
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                          {localized(p.description, p.description_fr)}
                        </p>
                      )}

                      {localized(p.criteria, p.criteria_fr) && (
                        <div className="bg-surface rounded-xl p-4 flex items-start gap-3 mb-4">
                          <ListChecks className="text-accent flex-shrink-0 mt-0.5" size={18} />
                          <p className="text-sm text-foreground leading-relaxed">
                            {localized(p.criteria, p.criteria_fr)}
                          </p>
                        </div>
                      )}

                      <Button
                        variant="gold"
                        size="sm"
                        className="gap-2"
                        onClick={() => setApplyingTo({ id: p.id, title: localized(p.title, p.title_fr) })}
                      >
                        {lang === "fr" ? "Postuler à ce poste" : "Apply for this position"} <ArrowRight size={14} />
                      </Button>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          <AnimatedSection delay={0.2}>
            <div className="mt-12 text-center bg-surface rounded-2xl p-8">
              <h3 className="text-xl font-serif font-bold mb-2">
                {lang === "fr" ? "Une autre idée de contribution ?" : "Another way you'd like to help?"}
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                {lang === "fr"
                  ? "Envoyez-nous une candidature spontanée, même sans poste précis en tête."
                  : "Send us a spontaneous application, even without a specific position in mind."}
              </p>
              <Button
                variant="gold"
                className="gap-2"
                onClick={() => setApplyingTo({ id: null, title: lang === "fr" ? "Candidature spontanée" : "Spontaneous application" })}
              >
                {lang === "fr" ? "Postuler maintenant" : "Apply now"} <ArrowRight size={16} />
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Dialog open={applyingTo !== null} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {lang === "fr" ? "Postuler" : "Apply"} — {applyingTo?.title}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <Honeypot value={honeypot} onChange={setHoneypot} />

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField icon={User} label={lang === "fr" ? "Prénom *" : "First name *"}>
                <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} maxLength={60} className={fieldInputClass} />
              </FormField>
              <FormField icon={User} label={lang === "fr" ? "Nom *" : "Last name *"}>
                <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} maxLength={60} className={fieldInputClass} />
              </FormField>
            </div>

            <FormField icon={Mail} label={lang === "fr" ? "Adresse e-mail *" : "Email address *"}>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={255}
                className={fieldInputClass}
              />
            </FormField>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField icon={Globe2} label={lang === "fr" ? "Pays de résidence" : "Country of residence"}>
                <CountrySelect value={form.country} onChange={(code) => setForm({ ...form, country: code })} lang={lang} />
              </FormField>
              <FormField icon={User} label={lang === "fr" ? "Téléphone (facultatif)" : "Phone (optional)"}>
                <PhoneInput value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} preferredCountry={form.country} lang={lang} />
              </FormField>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField icon={Briefcase} label={lang === "fr" ? "Profession actuelle" : "Current occupation"}>
                <Input value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} maxLength={100} className={fieldInputClass} />
              </FormField>
              <FormField icon={Building2} label={lang === "fr" ? "Organisation (facultatif)" : "Organization (optional)"}>
                <Input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} maxLength={100} className={fieldInputClass} />
              </FormField>
            </div>

            <FormField icon={GraduationCap} label={lang === "fr" ? "Compétences / domaines d'expertise" : "Skills / areas of expertise"}>
              <Input
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                maxLength={200}
                className={fieldInputClass}
                placeholder={lang === "fr" ? "Ex : gestion de projet, communication..." : "E.g. project management, communications..."}
              />
            </FormField>

            <FormField icon={CalendarClock} label={lang === "fr" ? "Disponibilité (facultatif)" : "Availability (optional)"}>
              <Input
                value={form.availability}
                onChange={(e) => setForm({ ...form, availability: e.target.value })}
                maxLength={200}
                className={fieldInputClass}
                placeholder={lang === "fr" ? "Ex : temps plein, week-ends, 10h/semaine..." : "E.g. full-time, weekends, 10h/week..."}
              />
            </FormField>

            <PdfUploadField
              label={lang === "fr" ? "CV (PDF) *" : "CV (PDF) *"}
              file={cvFile}
              onFileChange={setCvFile}
              uploading={sending}
              uploadPct={cvUploadPct}
              required
              lang={lang}
            />

            <PdfUploadField
              label={lang === "fr" ? "Lettre de motivation (PDF) *" : "Cover letter (PDF) *"}
              file={letterFile}
              onFileChange={setLetterFile}
              uploading={sending}
              uploadPct={letterUploadPct}
              required
              lang={lang}
            />

            <Button type="submit" variant="gold" className="w-full gap-2" disabled={sending}>
              {sending ? <Loader2 size={16} className="animate-spin" /> : <>{lang === "fr" ? "Envoyer ma candidature" : "Send application"} <Send size={16} /></>}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Volunteer;
