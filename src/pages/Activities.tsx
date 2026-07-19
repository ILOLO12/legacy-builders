import AnimatedSection from "@/components/AnimatedSection";
import Counter from "@/components/Counter";
import { BookOpen, HeartPulse, Users, Star } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSEO } from "@/hooks/useSEO";

const Activities = () => {
  const { t } = useLanguage();
  useSEO("Our Activities", "Explore MUFO's timeline, field projects, and community impact.");

  const timeline = [
    { year: "2021", title: t.activities.t2021, desc: t.activities.t2021Desc, icon: Star },
    { year: "2023", title: t.activities.t2023, desc: t.activities.t2023Desc, icon: BookOpen },
    { year: "2024", title: t.activities.t2024, desc: t.activities.t2024Desc, icon: HeartPulse },
    { year: "2025", title: t.activities.t2025, desc: t.activities.t2025Desc, icon: Users },
  ];

  const projects = [t.activities.proj1, t.activities.proj2, t.activities.proj3];

  return (
    <div>
      <section className="page-hero">
        <div className="section-container">
          <h1 className="page-hero-title">{t.activities.title}</h1>
          <div className="gold-line mt-6" />
          <p className="page-hero-subtitle mt-6">{t.activities.subtitle}</p>
        </div>
      </section>

      <section className="navy-section">
        <div className="section-container grid grid-cols-2 md:grid-cols-4 gap-10">
          <Counter end={4000} suffix="+" label={t.home.childrenSupported} />
          <Counter end={19} label={t.home.fieldActions} />
          <Counter end={3} suffix="+" label={t.home.areasReached} />
          <Counter end={2021} label={t.home.founded} />
        </div>
      </section>

      <section className="py-20">
        <div className="section-container max-w-3xl mx-auto">
          <AnimatedSection>
            <h2 className="section-title">{t.activities.ourJourney}</h2>
            <div className="gold-line mb-16" />
          </AnimatedSection>
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />
            {timeline.map((item, i) => (
              <AnimatedSection key={item.year} delay={i * 0.15}>
                <div className={`relative flex items-start gap-6 mb-14 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-surface border-2 border-primary flex items-center justify-center z-10">
                    <item.icon className="text-primary" size={20} />
                  </div>
                  <div className={`ml-20 md:ml-0 md:w-[calc(50%-3rem)] ${i % 2 === 0 ? "" : "md:text-right"}`}>
                    <span className="text-sm font-bold text-accent">{item.year}</span>
                    <h3 className="text-xl font-serif font-semibold mt-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="section-container">
          <AnimatedSection>
            <h2 className="section-title">{t.activities.projectHighlights}</h2>
            <div className="gold-line mb-12" />
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {projects.map((title, i) => (
              <AnimatedSection key={title} delay={i * 0.1}>
                <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center">
                    <span className="text-muted-foreground/40 text-xs uppercase">Photo</span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif font-semibold mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground">{t.activities.projDesc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Activities;
