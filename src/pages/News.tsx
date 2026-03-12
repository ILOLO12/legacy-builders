import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage } from "@/i18n/LanguageContext";
import { Newspaper, Calendar } from "lucide-react";

const newsItems = [
  { date: "2025-02-15", titleKey: "news1Title" as const, descKey: "news1Desc" as const },
  { date: "2024-11-20", titleKey: "news2Title" as const, descKey: "news2Desc" as const },
  { date: "2024-08-10", titleKey: "news3Title" as const, descKey: "news3Desc" as const },
  { date: "2024-03-05", titleKey: "news4Title" as const, descKey: "news4Desc" as const },
];

const News = () => {
  const { t } = useLanguage();

  return (
    <div>
      {/* Hero */}
      <section className="navy-section pt-28 pb-16">
        <div className="section-container text-center">
          <AnimatedSection>
            <Newspaper className="mx-auto text-accent mb-4" size={40} />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground">
              {t.news.title}
            </h1>
            <p className="mt-4 text-primary-foreground/70 max-w-2xl mx-auto">
              {t.news.subtitle}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20">
        <div className="section-container max-w-4xl mx-auto">
          <div className="space-y-8">
            {newsItems.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="card-hover flex flex-col md:flex-row gap-6">
                  {/* Image placeholder */}
                  <div className="md:w-64 flex-shrink-0 aspect-video md:aspect-[4/3] rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
                    <Newspaper className="text-primary/30" size={40} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                      <Calendar size={14} />
                      <time>{new Date(item.date).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}</time>
                    </div>
                    <h3 className="text-lg font-serif font-semibold mb-2">{t.news[item.titleKey]}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{t.news[item.descKey]}</p>
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

export default News;
