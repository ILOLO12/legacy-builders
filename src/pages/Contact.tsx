import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AnimatedSection from "@/components/AnimatedSection";
import { MapPin, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useSEO } from "@/hooks/useSEO";

const Contact = () => {
  const { t } = useLanguage();
  useSEO("Contact Us", "Get in touch with Muller's Foundation (MUFO). We have offices in DR Congo, USA, France, and Canada.");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const offices = [
    { country: t.contact.drCongo, city: t.contact.kinshasa, type: t.contact.headquarters },
    { country: t.contact.usa, city: t.contact.usaOffice, type: t.contact.representation },
    { country: t.contact.france, city: t.contact.franceOffice, type: t.contact.representation },
    { country: t.contact.canada, city: t.contact.canadaOffice, type: t.contact.representation },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error(t.contact.errorFields);
      return;
    }
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim() || null,
      message: form.message.trim(),
    });
    setSending(false);
    if (error) {
      toast.error(t.contact.errorFields);
      return;
    }
    toast.success(t.contact.successMsg);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div>
      <section className="page-hero">
        <div className="section-container">
          <h1 className="page-hero-title">{t.contact.title}</h1>
          <div className="gold-line mt-6" />
          <p className="page-hero-subtitle mt-6">{t.contact.subtitle}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
            <AnimatedSection>
              <h2 className="text-2xl font-serif font-bold mb-6">{t.contact.sendMessage}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder={t.contact.fullName} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} />
                <Input type="email" placeholder={t.contact.email} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} />
                <Input placeholder={t.contact.subject} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} maxLength={200} />
                <Textarea placeholder={t.contact.message} rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={1000} />
                <Button type="submit" className="w-full sm:w-auto px-8" disabled={sending}>{sending ? "..." : t.contact.send}</Button>
              </form>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <h2 className="text-2xl font-serif font-bold mb-6">{t.contact.ourOffices}</h2>
              <div className="space-y-3">
                {offices.map((o) => (
                  <div key={o.country} className="flex items-start gap-3 p-4 bg-surface rounded-lg">
                    <MapPin className="text-primary mt-0.5 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-semibold text-sm">{o.country}</p>
                      <p className="text-xs text-muted-foreground">{o.type} — {o.city}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="text-primary" size={20} />
                  <span className="text-sm">info@mullersfoundation.org</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-primary" size={20} />
                  <span className="text-sm">+243 000 000 000</span>
                </div>
              </div>

              <div className="mt-8 bg-muted rounded-xl h-48 flex items-center justify-center border border-border">
                <p className="text-muted-foreground text-sm">{t.contact.mapPlaceholder}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
