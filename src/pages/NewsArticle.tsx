import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AnimatedSection from "@/components/AnimatedSection";
import { useLanguage } from "@/i18n/LanguageContext";
import { localeFor } from "@/i18n/locale";
import { Newspaper, Calendar, ArrowLeft } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/integrations/supabase/client";
import ShareButtons from "@/components/ShareButtons";

const NewsArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguage();

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const localized = (en: string | null, fr: string | null) => (lang === "fr" && fr ? fr : en ?? "");

  useSEO(
    article ? localized(article.title, article.title_fr) : "News",
    article ? localized(article.excerpt, article.excerpt_fr) ?? undefined : "Latest news and updates from Muller's Foundation (MUFO)."
  );

  if (isLoading) {
    return <div className="py-32 text-center text-muted-foreground">{lang === "fr" ? "Chargement..." : "Loading..."}</div>;
  }

  if (!article) {
    return (
      <div className="py-32 text-center">
        <p className="text-muted-foreground mb-4">{lang === "fr" ? "Article introuvable." : "Article not found."}</p>
        <Link to="/news" className="text-accent underline">{lang === "fr" ? "Retour aux actualités" : "Back to news"}</Link>
      </div>
    );
  }

  return (
    <div>
      <section className="navy-section pt-28 pb-16">
        <div className="section-container max-w-3xl mx-auto">
          <AnimatedSection>
            <Link to="/news" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-6">
              <ArrowLeft size={16} /> {lang === "fr" ? "Toutes les actualités" : "All news"}
            </Link>
            <div className="flex items-center gap-2 text-primary-foreground/60 text-xs mb-3">
              <Calendar size={14} />
              <time>
                {new Date(article.published_at ?? article.created_at).toLocaleDateString(localeFor(lang), { year: "numeric", month: "long", day: "numeric" })}
              </time>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground">
              {localized(article.title, article.title_fr)}
            </h1>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16">
        <div className="section-container max-w-3xl mx-auto">
          {article.image_url ? (
            <img src={article.image_url} alt={localized(article.title, article.title_fr)} className="w-full rounded-xl mb-10 aspect-video object-cover" loading="lazy" />
          ) : (
            <div className="w-full rounded-xl mb-10 aspect-video bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
              <Newspaper className="text-primary/30" size={48} />
            </div>
          )}
          <div className="prose-content text-foreground leading-relaxed whitespace-pre-wrap">
            {localized(article.content, article.content_fr) || localized(article.excerpt, article.excerpt_fr)}
          </div>

          <div className="mt-10 pt-6 border-t border-border">
            <ShareButtons
              url={typeof window !== "undefined" ? window.location.href : ""}
              title={localized(article.title, article.title_fr)}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsArticle;
