import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AnimatedSection from "@/components/AnimatedSection";
import FormField, { fieldInputClass } from "@/components/FormField";
import { CreditCard, Smartphone, Globe, DollarSign, User, Mail, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { usePageContent } from "@/hooks/usePageContent";
import { supabase } from "@/integrations/supabase/client";

const PRESET_AMOUNTS = [10, 25, 50, 100, 250];

const Donate = () => {
  const { t, lang } = useLanguage();
  useSEO("Donate", "Support Muller's Foundation (MUFO) and help us restore hope and build a lasting legacy.");
  const c = usePageContent("donate", {
    ...t.donateP,
    eduPct: "60",
    healthPct: "25",
    philPct: "10",
    adminPct: "5",
  });

  const [amount, setAmount] = useState<number | "">(50);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<{ key: string; name: string } | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const methods = [
    { key: "bank_transfer", icon: CreditCard, name: c.bankTransfer, desc: c.bankDesc },
    { key: "mobile_money", icon: Smartphone, name: c.mobileMoney, desc: c.mobileDesc },
    { key: "paypal", icon: Globe, name: c.paypal, desc: c.paypalDesc },
    { key: "zelle", icon: DollarSign, name: c.zelle, desc: c.zelleDesc },
  ];

  const finalAmount = customAmount.trim() !== "" ? Number(customAmount) : amount;

  const closeDialog = () => {
    setSelectedMethod(null);
    setForm({ name: "", email: "", message: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !selectedMethod || !finalAmount || finalAmount <= 0) {
      toast.error(lang === "fr" ? "Merci de remplir les champs obligatoires." : "Please fill in the required fields.");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("donations").insert({
      donor_name: form.name.trim(),
      donor_email: form.email.trim(),
      amount: finalAmount,
      method: selectedMethod.key,
      message: form.message.trim() || null,
    });
    setSending(false);
    if (error) {
      toast.error(lang === "fr" ? "Une erreur est survenue. Réessayez." : "Something went wrong. Please try again.");
      return;
    }
    toast.success(
      lang === "fr"
        ? "Merci ! Nous avons bien reçu votre intention de don et allons vous recontacter avec les instructions."
        : "Thank you! We've recorded your donation and will follow up with instructions."
    );
    closeDialog();
  };

  const allocation = [
    { label: c.education, pct: Number(c.eduPct) || 0, color: "bg-primary" },
    { label: c.health, pct: Number(c.healthPct) || 0, color: "bg-accent" },
    { label: c.philanthropy, pct: Number(c.philPct) || 0, color: "bg-secondary" },
    { label: c.administration, pct: Number(c.adminPct) || 0, color: "bg-muted-foreground" },
  ];

  return (
    <div>
      <section className="navy-section text-center">
        <div className="section-container">
          <AnimatedSection>
            <div className="gold-line mb-8" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-4">
              {c.heroTitle}
            </h1>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg">{c.heroSub}</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20">
        <div className="section-container">
          <AnimatedSection>
            <h2 className="section-title">{lang === "fr" ? "Choisissez un montant" : "Choose an amount"}</h2>
            <div className="gold-line mb-12" />
          </AnimatedSection>
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {PRESET_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => { setAmount(a); setCustomAmount(""); }}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold border-2 transition-colors ${
                    amount === a && customAmount === ""
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-card border-border hover:border-accent/50"
                  }`}
                >
                  ${a}
                </button>
              ))}
              <Input
                type="number"
                min={1}
                placeholder={lang === "fr" ? "Autre montant" : "Custom amount"}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-36 text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="section-container">
          <AnimatedSection>
            <h2 className="section-title">{c.howToDonate}</h2>
            <div className="gold-line mb-12" />
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {methods.map((m, i) => (
              <AnimatedSection key={m.key} delay={i * 0.1}>
                <div className="card-hover h-full flex flex-col bg-card">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <m.icon className="text-accent" size={28} />
                  </div>
                  <h3 className="font-serif font-semibold mb-2">{m.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6 flex-1">{m.desc}</p>
                  <Button
                    variant="gold"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedMethod({ key: m.key, name: m.name })}
                  >
                    {c.donateNow}
                  </Button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="section-container max-w-2xl mx-auto">
          <AnimatedSection>
            <h2 className="section-title">{c.fundsAllocation}</h2>
            <div className="gold-line mb-12" />
            <div className="space-y-5">
              {allocation.map((a) => (
                <div key={a.label}>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span>{a.label}</span>
                    <span className="text-accent font-bold">{a.pct}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-3 overflow-hidden">
                    <div className={`h-full rounded-full ${a.color} transition-all duration-1000`} style={{ width: `${a.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Dialog open={selectedMethod !== null} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {c.donateNow} — ${finalAmount || 0} {selectedMethod ? `(${selectedMethod.name})` : ""}
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground -mt-2">
            {lang === "fr"
              ? "Nous enregistrons votre intention de don et vous recontactons avec les instructions de paiement — aucun paiement n'est prélevé ici."
              : "We record your donation pledge and follow up with payment instructions — nothing is charged here."}
          </p>
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
              {sending ? "..." : <>{c.donateNow} <Send size={16} /></>}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Donate;
