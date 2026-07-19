import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import { CreditCard, Smartphone, Globe, DollarSign } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSEO } from "@/hooks/useSEO";

const Donate = () => {
  const { t } = useLanguage();
  useSEO("Donate", "Support Muller's Foundation (MUFO) and help us restore hope and build a lasting legacy.");

  const methods = [
    { icon: CreditCard, name: t.donateP.bankTransfer, desc: t.donateP.bankDesc },
    { icon: Smartphone, name: t.donateP.mobileMoney, desc: t.donateP.mobileDesc },
    { icon: Globe, name: t.donateP.paypal, desc: t.donateP.paypalDesc },
    { icon: DollarSign, name: t.donateP.zelle, desc: t.donateP.zelleDesc },
  ];

  const allocation = [
    { label: t.donateP.education, pct: 60, color: "bg-primary" },
    { label: t.donateP.health, pct: 25, color: "bg-accent" },
    { label: t.donateP.philanthropy, pct: 10, color: "bg-secondary" },
    { label: t.donateP.administration, pct: 5, color: "bg-muted-foreground" },
  ];

  return (
    <div>
      <section className="navy-section text-center">
        <div className="section-container">
          <AnimatedSection>
            <div className="gold-line mb-8" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-4">
              {t.donateP.heroTitle}
            </h1>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg">{t.donateP.heroSub}</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20">
        <div className="section-container">
          <AnimatedSection>
            <h2 className="section-title">{t.donateP.howToDonate}</h2>
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
                    <Link to="/contact">{t.donateP.donateNow}</Link>
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
            <h2 className="section-title">{t.donateP.fundsAllocation}</h2>
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
