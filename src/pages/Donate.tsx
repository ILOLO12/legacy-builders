import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import { CreditCard, Smartphone, Globe, DollarSign } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { usePageContent } from "@/hooks/usePageContent";

const Donate = () => {
  const { t } = useLanguage();
  useSEO("Donate", "Support Muller's Foundation (MUFO) and help us restore hope and build a lasting legacy.");
  const c = usePageContent("donate", {
    ...t.donateP,
    eduPct: "60",
    healthPct: "25",
    philPct: "10",
    adminPct: "5",
  });

  const methods = [
    { icon: CreditCard, name: c.bankTransfer, desc: c.bankDesc },
    { icon: Smartphone, name: c.mobileMoney, desc: c.mobileDesc },
    { icon: Globe, name: c.paypal, desc: c.paypalDesc },
    { icon: DollarSign, name: c.zelle, desc: c.zelleDesc },
  ];

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
            <h2 className="section-title">{c.howToDonate}</h2>
            <div className="gold-line mb-12" />
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {methods.map((m, i) => (
              <AnimatedSection key={m.name} delay={i * 0.1}>
                <div className="card-hover h-full flex flex-col">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <m.icon className="text-accent" size={28} />
                  </div>
                  <h3 className="font-serif font-semibold mb-2">{m.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6 flex-1">{m.desc}</p>
                  <Button variant="gold" size="sm" className="w-full" asChild>
                    <Link to="/contact">{c.donateNow}</Link>
                  </Button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface">
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
    </div>
  );
};

export default Donate;
