import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, MapPin, ListChecks, ArrowRight, Megaphone, User, Mail, Phone, MessageSquare, Send } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FormField, { fieldInputClass } from "@/components/FormField";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/integrations/supabase/client";

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

  const [applyingTo, setApplyingTo] = useState<{ id: string | null; title: string } | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const closeDialog = () => {
    setApplyingTo(null);
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error(lang === "fr" ? "Merci de remplir les champs obligatoires." : "Please fill in the required fields.");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("volunteer_applications").insert({
      position_id: applyingTo?.id ?? null,
      position_title: applyingTo?.title ?? null,
      applicant_name: form.name.trim(),
      applicant_email: form.email.trim(),
      applicant_phone: form.phone.trim() || null,
      message: form.message.trim() || null,
    });
    setSending(false);
    if (error) {
      toast.error(lang === "fr" ? "Une erreur est survenue. Réessayez." : "Something went wrong. Please try again.");
      return;
    }
    toast.success(
      lang === "fr" ? "Merci ! Votre candidature a bien été envoyée." : "Thank you! Your application has been sent."
    );
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
            <FormField icon={User} label={lang === "fr" ? "Nom complet *" : "Full name *"}>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={100}
                className={fieldInputClass}
              />
            </FormField>
            <FormField icon={Mail} label={lang === "fr" ? "Adresse e-mail *" : "Email address *"}>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={255}
                className={fieldInputClass}
              />
            </FormField>
            <FormField icon={Phone} label={lang === "fr" ? "Téléphone (facultatif)" : "Phone (optional)"}>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                maxLength={30}
                className={fieldInputClass}
              />
            </FormField>
            <FormField icon={MessageSquare} label={lang === "fr" ? "Motivation / message" : "Motivation / message"}>
              <Textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={2000}
                className={fieldInputClass}
              />
            </FormField>
            <Button type="submit" variant="gold" className="w-full gap-2" disabled={sending}>
              {sending ? "..." : <>{lang === "fr" ? "Envoyer ma candidature" : "Send application"} <Send size={16} /></>}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Volunteer;
