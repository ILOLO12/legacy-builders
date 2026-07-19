import AnimatedSection from "@/components/AnimatedSection";
import founderImg from "@/assets/founder.jpg";
import { useLanguage } from "@/i18n/LanguageContext";
import { usePageContent } from "@/hooks/usePageContent";

const Founder = () => {
  const { t } = useLanguage();
  const c = usePageContent("founder", t.founder as any);

  const quotes = [c.quote1, c.quote2];

  return (
    <div>
      <section className="page-hero">
        <div className="section-container">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">{c.aboutMufo}</p>
          <h1 className="page-hero-title">{c.title}</h1>
          <div className="gold-line mt-6" />
          <p className="page-hero-subtitle mt-6">{c.subtitle}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
            <AnimatedSection>
              <div className="relative">
                <img src={founderImg} alt={c.name} className="rounded-xl shadow-2xl w-full max-w-md mx-auto" />
                <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-accent/15 rounded-xl -z-10" />
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary/10 rounded-xl -z-10" />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2">{c.name}</h2>
                <p className="text-accent font-semibold mb-8 uppercase tracking-wider text-sm">{c.role}</p>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>{c.bio1}</p>
                  <p>{c.bio2}</p>
                  <p>{c.bio3}</p>
                  <p>{c.bio4}</p>
                </div>
                <div className="mt-10 space-y-4">
                  {quotes.map((q, i) => (
                    <div key={i} className="gold-border-box">
                      <p className="font-serif italic text-foreground">"{q}"</p>
                      <p className="text-xs text-accent mt-2 font-semibold">— {c.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Founder;
