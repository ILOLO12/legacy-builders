import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import { Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { usePageContent } from "@/hooks/usePageContent";

const Membership = () => {
  const { t } = useLanguage();
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
                  <Button variant={tier.featured ? "gold" : "default"} className="w-full">
                    {c.joinNow}
                  </Button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Membership;
