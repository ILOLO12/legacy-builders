import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AnimatedSection from "@/components/AnimatedSection";
import FormField, { fieldInputClass } from "@/components/FormField";
import { Check, User, Mail, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { usePageContent } from "@/hooks/usePageContent";
import { supabase } from "@/integrations/supabase/client";

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
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

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
    setForm({ name: "", email: "", message: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !selectedTier) {
      toast.error(lang === "fr" ? "Merci de remplir les champs obligatoires." : "Please fill in the required fields.");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("membership_signups").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      tier: selectedTier,
      message: form.message.trim() || null,
    });
    setSending(false);
    if (error) {
      toast.error(lang === "fr" ? "Une erreur est survenue. Réessayez." : "Something went wrong. Please try again.");
      return;
    }
    toast.success(lang === "fr" ? "Merci ! Votre demande d'adhésion a bien été envoyée." : "Thank you! Your membership request has been sent.");
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{c.joinNow} — {selectedTier}</DialogTitle>
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
            <FormField icon={MessageSquare} label={lang === "fr" ? "Message (facultatif)" : "Message (optional)"}>
              <Textarea
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={1000}
                className={fieldInputClass}
              />
            </FormField>
            <Button type="submit" variant="gold" className="w-full gap-2" disabled={sending}>
              {sending ? "..." : <>{c.joinNow} <Send size={16} /></>}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Membership;
