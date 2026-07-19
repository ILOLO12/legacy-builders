import AnimatedSection from "@/components/AnimatedSection";
import { BookOpen, Award, Heart, Stethoscope, Lightbulb, Shield, Scale, Gem } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSEO } from "@/hooks/useSEO";

const History = () => {
  const { t } = useLanguage();
  useSEO("Our History", "Discover the history and founding story of Muller's Foundation (MUFO).");

  const values = [
    { icon: Heart, name: t.history.compassion, desc: t.history.compassionDesc },
    { icon: Shield, name: t.history.integrity, desc: t.history.integrityDesc },
    { icon: Award, name: t.history.excellence, desc: t.history.excellenceDesc },
    { icon: Scale, name: t.history.equity, desc: t.history.equityDesc },
    { icon: Gem, name: t.history.legacy, desc: t.history.legacyDesc },
  ];

  return (
    <div>
      <section className="page-hero">
        <div className="section-container">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">{t.history.aboutMufo}</p>
          <h1 className="page-hero-title">{t.history.title}</h1>
          <div className="gold-line mt-6" />
          <p className="page-hero-subtitle mt-6">{t.history.subtitle}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="section-container max-w-3xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-serif font-bold mb-6 text-center">{t.history.meaningTitle}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{t.history.meaningP1}</p>
            <p className="text-muted-foreground leading-relaxed mb-4">{t.history.meaningP2}</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="section-container grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="card-hover text-left">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="text-primary" size={24} />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">{t.history.vision}</h3>
              <p className="text-muted-foreground leading-relaxed">{t.history.visionText}</p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <div className="card-hover text-left">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Award className="text-accent" size={24} />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">{t.history.mission}</h3>
              <p className="text-muted-foreground leading-relaxed">{t.history.missionText}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20">
        <div className="section-container">
          <AnimatedSection>
            <h2 className="section-title">{t.history.threePillars}</h2>
            <div className="gold-line mb-12" />
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Heart, title: t.history.pillar1, desc: t.history.pillar1Desc },
              { icon: Stethoscope, title: t.history.pillar2, desc: t.history.pillar2Desc },
              { icon: Lightbulb, title: t.history.pillar3, desc: t.history.pillar3Desc },
            ].map((p, i) => (
              <AnimatedSection key={p.title} delay={i * 0.15}>
                <div className="card-hover h-full">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <p.icon className="text-primary" size={28} />
                  </div>
                  <h3 className="text-xl font-serif font-semibold mb-3">{p.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="section-container">
          <AnimatedSection>
            <h2 className="section-title">{t.history.coreValues}</h2>
            <div className="gold-line mb-12" />
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {values.map((v, i) => (
              <AnimatedSection key={v.name} delay={i * 0.1}>
                <div className="card-hover h-full">
                  <v.icon className="text-accent mx-auto mb-3" size={28} />
                  <h4 className="font-serif font-semibold mb-1">{v.name}</h4>
                  <p className="text-xs text-muted-foreground">{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default History;
