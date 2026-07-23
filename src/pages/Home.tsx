import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  BookOpen, HeartPulse, Users, ArrowRight, GraduationCap, Stethoscope,
  Lightbulb, Shield, Clapperboard, Handshake, Quote, School, Rocket
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import Counter from "@/components/Counter";
import MediaCarousel from "@/components/MediaCarousel";
import heroBg1 from "@/assets/hero-bg.jpg";
import heroBg2 from "@/assets/hero-bg-2.jpg";
import heroBg3 from "@/assets/hero-bg-3.jpg";
import heroBg4 from "@/assets/hero-bg-4.jpg";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useSEO } from "@/hooks/useSEO";
import { usePageContent } from "@/hooks/usePageContent";

const heroImages = [heroBg1, heroBg2, heroBg3, heroBg4];

const Home = () => {
  const { t } = useLanguage();
  useSEO("Home", "International humanitarian NGO transforming potential into sustainable opportunity through education, health, and community development.");
  const c = usePageContent("home", t.home);
  const { data: partners = [] } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data, error } = await supabase.from("partners").select("*").order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
  const { data: testimonials = [] } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
  const [scrollY, setScrollY] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  // Only the current slide plus the next one are ever mounted, so the browser
  // isn't forced to download all hero images (~800kB) on first paint.
  const [loadedImages, setLoadedImages] = useState(() => new Set([0, 1 % heroImages.length]));

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => {
        const next = (prev + 1) % heroImages.length;
        const upcoming = (next + 1) % heroImages.length;
        setLoadedImages((loaded) => new Set(loaded).add(next).add(upcoming));
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const pillars = [
    { icon: BookOpen, title: c.pillarEdu, desc: c.pillarEduDesc, tone: "primary" as const },
    { icon: HeartPulse, title: c.pillarHealth, desc: c.pillarHealthDesc, tone: "accent" as const },
    { icon: Users, title: c.pillarDev, desc: c.pillarDevDesc, tone: "primary" as const },
  ];

  const objectives = [
    { icon: GraduationCap, title: c.obj1 },
    { icon: Stethoscope, title: c.obj2 },
    { icon: Lightbulb, title: c.obj3 },
    { icon: Shield, title: c.obj4 },
  ];

  const realisations = [
    { icon: GraduationCap, text: c.achievement1 },
    { icon: School, text: c.achievement2 },
    { icon: HeartPulse, text: c.achievement3 },
    { icon: Rocket, text: c.achievement4 },
  ];

  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((img, i) =>
            loadedImages.has(i) ? (
              <img
                key={i}
                src={img}
                alt={`Hero background ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
                className="absolute inset-0 w-full h-full object-cover object-center will-change-transform transition-opacity duration-1000 ease-in-out"
                style={{
                  transform: `translateY(${scrollY * 0.35}px) scale(1.1)`,
                  opacity: currentImage === i ? 1 : 0,
                }}
              />
            ) : null
          )}
          <div className="absolute inset-0 bg-primary/65" />
        </div>
        <div className="relative z-10 section-container text-center text-primary-foreground py-20">
          <AnimatedSection>
            <div className="gold-line mb-8" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight max-w-4xl mx-auto">
              {c.heroTitle}
            </h1>
            <p className="mt-6 text-lg md:text-xl opacity-80 max-w-2xl mx-auto font-light">
              {c.heroSub}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/founder">
                <Button variant="hero-outline" size="lg" className="text-base px-8">
                  {t.home.learnMore}
                </Button>
              </Link>
              <Link to="/donate">
                <Button variant="gold" size="lg" className="text-base px-8">
                  {t.home.donate}
                </Button>
              </Link>
            </div>
            {/* Dot indicators */}
            <div className="mt-8 flex justify-center gap-2">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentImage === i
                      ? "bg-accent w-6"
                      : "bg-primary-foreground/40 hover:bg-primary-foreground/60"
                  }`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── IMPACT COUNTERS ─── */}
      <section className="navy-section">
        <div className="section-container grid grid-cols-2 md:grid-cols-4 gap-10">
          <Counter end={4000} suffix="+" label={c.childrenSupported} />
          <Counter end={19} label={c.fieldActions} />
          <Counter end={3} suffix="+" label={c.areasReached} />
          <Counter end={2021} label={c.founded} />
        </div>
      </section>

      {/* ─── WHO WE ARE ─── */}
      <section className="py-20">
        <div className="section-container max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="section-title">{c.whoWeAre}</h2>
            <div className="gold-line mb-8" />
            <p className="text-muted-foreground leading-relaxed mb-8">
              {c.whoWeAreText}
            </p>
            <Link to="/history">
              <Button variant="outline" className="gap-2">
                {t.home.discoverStory} <ArrowRight size={16} />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── OUR MISSION ─── */}
      <section className="py-20 bg-surface">
        <div className="section-container max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">{c.ourMission}</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold leading-relaxed">
              {c.missionText}
            </h2>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── OUR OBJECTIVES ─── */}
      <section className="py-20">
        <div className="section-container">
          <AnimatedSection>
            <h2 className="section-title">{c.ourObjectives}</h2>
            <div className="gold-line mb-12" />
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {objectives.map((o, i) => (
              <AnimatedSection key={o.title} delay={i * 0.1}>
                <div className="group relative h-full bg-gradient-to-b from-card to-surface border border-border rounded-2xl pt-8 pb-7 px-6 text-center overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 hover:border-accent/50 transition-all duration-300">
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-gold-dark via-accent to-gold-light" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-gold-dark shadow-lg shadow-accent/20 flex items-center justify-center mx-auto mb-5 rotate-3 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300">
                    <o.icon className="text-white" size={28} strokeWidth={1.75} />
                  </div>
                  <p className="text-sm font-semibold leading-snug text-foreground">{o.title}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THREE PILLARS ─── */}
      <section className="py-20 bg-surface">
        <div className="section-container">
          <AnimatedSection>
            <h2 className="section-title">{c.threePillars}</h2>
            <div className="gold-line mb-12" />
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pillars.map((p, i) => {
              const isAccent = p.tone === "accent";
              return (
                <AnimatedSection key={p.title} delay={i * 0.15}>
                  <div className="group relative h-full bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
                    <div className={`h-1.5 w-full ${isAccent ? "bg-gradient-to-r from-gold-dark via-accent to-gold-light" : "bg-gradient-to-r from-primary via-secondary to-primary"}`} />
                    <div className="p-8 text-center">
                      <div className={`relative w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform duration-300 ${
                        isAccent ? "bg-gradient-to-br from-accent to-gold-dark" : "bg-gradient-to-br from-primary to-secondary"
                      }`}>
                        <p.icon className="text-white" size={32} strokeWidth={1.75} />
                      </div>
                      <h3 className="text-xl font-serif font-semibold mb-3">{p.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── OUR STORY PREVIEW ─── */}
      <section className="py-20">
        <div className="section-container max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">{c.ourStory}</p>
            <h2 className="section-title mb-6">{c.millerLegacy}</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {c.storyText}
            </p>
            <Link to="/history">
              <Button variant="outline" className="gap-2">
                {t.home.learnMore} <ArrowRight size={16} />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── MULTIMEDIA: IMPACT IN ACTION ─── */}
      <section className="py-20 bg-surface">
        <div className="section-container">
          <AnimatedSection>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clapperboard className="text-accent" size={24} />
              <h2 className="section-title mb-0">{c.impactInAction}</h2>
            </div>
            <p className="section-subtitle">{c.impactSub}</p>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <MediaCarousel />
          </AnimatedSection>
        </div>
      </section>

      {/* ─── REALISATIONS ─── */}
      <section className="py-20">
        <div className="section-container max-w-4xl mx-auto">
          <AnimatedSection>
            <h2 className="section-title">{c.keyAchievements}</h2>
            <div className="gold-line mb-12" />
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 gap-5">
            {realisations.map((r, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="group relative flex items-start gap-4 p-6 bg-card border border-border rounded-2xl hover:shadow-xl hover:-translate-y-1 hover:border-accent/40 transition-all duration-300 h-full">
                  <span className="absolute top-3 right-4 font-serif text-3xl font-bold text-muted-foreground/15 select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/25 to-accent/5 ring-1 ring-accent/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <r.icon className="text-accent" size={22} strokeWidth={1.75} />
                  </div>
                  <p className="text-sm font-medium leading-relaxed pt-2 pr-6">{r.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/activities">
              <Button variant="outline" className="gap-2">
                {t.home.viewAllActivities} <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PARTNERS ─── */}
      {partners.length > 0 && (
        <section className="py-20 bg-surface">
          <div className="section-container">
            <AnimatedSection>
              <div className="flex items-center justify-center gap-3 mb-4">
                <Handshake className="text-accent" size={24} />
                <h2 className="section-title mb-0">{c.ourPartners}</h2>
              </div>
              <p className="section-subtitle">{c.partnersSub}</p>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-6 max-w-4xl mx-auto">
                {partners.map((p) => (
                  <a
                    key={p.id}
                    href={p.website_url ?? undefined}
                    target={p.website_url ? "_blank" : undefined}
                    rel={p.website_url ? "noopener noreferrer" : undefined}
                    className="aspect-square bg-card border border-border rounded-xl flex items-center justify-center hover:shadow-md transition-shadow p-3"
                  >
                    {p.logo_url ? (
                      <img src={p.logo_url} alt={p.name} className="max-w-full max-h-full object-contain" loading="lazy" />
                    ) : (
                      <div className="text-muted-foreground/30 text-xs uppercase tracking-wider font-medium text-center">
                        {p.name}
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ─── TESTIMONIALS ─── */}
      {testimonials.length > 0 && (
        <section className="py-20">
          <div className="section-container">
            <AnimatedSection>
              <h2 className="section-title text-center">{c.testimonialsTitle}</h2>
              <div className="gold-line mb-12 mx-auto" />
            </AnimatedSection>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {testimonials.map((tItem, i) => (
                <AnimatedSection key={tItem.id} delay={i * 0.1}>
                  <div className="bg-card border border-border rounded-xl p-6 h-full flex flex-col">
                    <Quote className="text-accent/40 mb-3" size={28} />
                    <p className="text-sm text-muted-foreground flex-1 mb-4 leading-relaxed">{tItem.quote}</p>
                    <div className="flex items-center gap-3">
                      {tItem.author_photo_url && (
                        <img src={tItem.author_photo_url} alt={tItem.author_name} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
                      )}
                      <div>
                        <p className="text-sm font-semibold">{tItem.author_name}</p>
                        {tItem.author_role && <p className="text-xs text-muted-foreground">{tItem.author_role}</p>}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── QUOTE ─── */}
      <section className="navy-section">
        <div className="section-container max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <div className="gold-line mb-8" />
            <p className="text-2xl md:text-3xl font-serif italic text-primary-foreground leading-relaxed">
              {c.quote}
            </p>
            <div className="gold-line mt-8" />
            <p className="mt-6 text-sm font-semibold text-accent uppercase tracking-wider">{c.mullersFoundation}</p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Home;
