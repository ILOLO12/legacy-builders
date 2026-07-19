import AnimatedSection from "@/components/AnimatedSection";
import { Shield, Heart, Mountain, Users } from "lucide-react";
import memorialImg from "@/assets/memorial.jpg";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSEO } from "@/hooks/useSEO";

const InMemoriam = () => {
  const { t } = useLanguage();
  useSEO("In Memoriam", "Honoring the memory and legacy of those who inspired Muller's Foundation (MUFO).");

  const values = [
    { icon: Shield, name: t.memoriam.responsibility },
    { icon: Heart, name: t.memoriam.dignity },
    { icon: Mountain, name: t.memoriam.perseverance },
    { icon: Users, name: t.memoriam.generationalImpact },
  ];

  return (
    <div>
      <section className="page-hero bg-muted">
        <div className="section-container">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">{t.memoriam.aboutMufo}</p>
          <h1 className="page-hero-title">{t.memoriam.title}</h1>
          <div className="gold-line mt-6" />
          <p className="page-hero-subtitle mt-6">{t.memoriam.subtitle}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="section-container max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="w-48 h-48 rounded-full overflow-hidden mx-auto mb-6 border-4 border-accent/30 shadow-xl">
                <img src={memorialImg} alt={t.memoriam.name} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2">{t.memoriam.name}</h2>
              <p className="text-accent font-semibold uppercase tracking-wider text-sm">{t.memoriam.honor}</p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="max-w-2xl mx-auto text-center space-y-4 text-muted-foreground leading-relaxed mb-16">
              <p>{t.memoriam.text1}</p>
              <p>{t.memoriam.text2}</p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <h3 className="text-2xl font-serif font-bold text-center mb-8">{t.memoriam.valuesTitle}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {values.map((v) => (
                <div key={v.name} className="card-hover">
                  <v.icon className="text-accent mx-auto mb-3" size={32} />
                  <p className="font-serif font-semibold text-sm">{v.name}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div className="mt-16 gold-border-box text-center max-w-xl mx-auto">
              <p className="font-serif italic text-foreground text-lg">{t.memoriam.endQuote}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default InMemoriam;
