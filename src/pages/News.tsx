import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage } from "@/i18n/LanguageContext";
import { localeFor } from "@/i18n/locale";
import { Newspaper, Calendar } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/integrations/supabase/client";

const News = () => {
  const { t, lang } = useLanguage();
  useSEO("News", "Latest news and updates from Muller's Foundation (MUFO).");

  const { data: articles = [] } = useQuery({
    queryKey: ["articles-published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const localized = (en: string | null, fr: string | null) => (lang === "fr" && fr ? fr : en ?? "");

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
          {articles.length === 0 ? (
            <p className="text-center text-muted-foreground">{lang === "fr" ? "Aucune actualité pour le moment." : "No news yet."}</p>
          ) : (
            <div className="space-y-8">
              {articles.map((item, i) => (
                <AnimatedSection key={item.id} delay={i * 0.1}>
                  <Link to={`/news/${item.slug}`} className="card-hover flex flex-col md:flex-row gap-6">
                    <div className="md:w-64 flex-shrink-0 aspect-video md:aspect-[4/3] rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center overflow-hidden">
                      {item.image_url ? (
                        <img src={item.image_url} alt={localized(item.title, item.title_fr)} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <Newspaper className="text-primary/30" size={40} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                        <Calendar size={14} />
                        <time>
                          {new Date(item.published_at ?? item.created_at).toLocaleDateString(localeFor(lang), { year: "numeric", month: "long", day: "numeric" })}
                        </time>
                      </div>
                      <h3 className="text-lg font-serif font-semibold mb-2">{localized(item.title, item.title_fr)}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{localized(item.excerpt, item.excerpt_fr)}</p>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default News;
