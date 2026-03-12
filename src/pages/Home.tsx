import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BookOpen, HeartPulse, Users, ArrowRight, GraduationCap, Stethoscope,
  Lightbulb, Shield, CheckCircle, Clapperboard, Handshake
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import Counter from "@/components/Counter";
import MediaCarousel from "@/components/MediaCarousel";
import heroBg from "@/assets/hero-bg.jpg";
import { useLanguage } from "@/i18n/LanguageContext";

const Home = () => {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const pillars = [
    { icon: BookOpen, title: t.home.pillarEdu, desc: t.home.pillarEduDesc },
    { icon: HeartPulse, title: t.home.pillarHealth, desc: t.home.pillarHealthDesc },
    { icon: Users, title: t.home.pillarDev, desc: t.home.pillarDevDesc },
  ];

  const objectives = [
    { icon: GraduationCap, title: t.home.obj1 },
    { icon: Stethoscope, title: t.home.obj2 },
    { icon: Lightbulb, title: t.home.obj3 },
    { icon: Shield, title: t.home.obj4 },
  ];

  const realisations = [
    t.home.achievement1,
    t.home.achievement2,
    t.home.achievement3,
    t.home.achievement4,
  ];

  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Children in classroom"
            className="w-full h-full object-cover object-center will-change-transform"
            style={{ transform: `translateY(${scrollY * 0.35}px) scale(1.1)` }}
          />
          <div className="absolute inset-0 bg-primary/65" />
        </div>
        <div className="relative z-10 section-container text-center text-primary-foreground py-20">
          <AnimatedSection>
            <div className="gold-line mb-8" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight max-w-4xl mx-auto">
              {t.home.heroTitle}
            </h1>
            <p className="mt-6 text-lg md:text-xl opacity-80 max-w-2xl mx-auto font-light">
              {t.home.heroSub}
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
          </AnimatedSection>
        </div>
      </section>

      {/* ─── IMPACT COUNTERS ─── */}
      <section className="navy-section">
        <div className="section-container grid grid-cols-2 md:grid-cols-4 gap-10">
          <Counter end={4000} suffix="+" label={t.home.childrenSupported} />
          <Counter end={19} label={t.home.fieldActions} />
          <Counter end={3} suffix="+" label={t.home.areasReached} />
          <Counter end={2021} label={t.home.founded} />
        </div>
      </section>

      {/* ─── WHO WE ARE ─── */}
      <section className="py-20">
        <div className="section-container max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="section-title">{t.home.whoWeAre}</h2>
            <div className="gold-line mb-8" />
            <p className="text-muted-foreground leading-relaxed mb-8">
              {t.home.whoWeAreText}
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
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">{t.home.ourMission}</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold leading-relaxed">
              {t.home.missionText}
            </h2>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── OUR OBJECTIVES ─── */}
      <section className="py-20">
        <div className="section-container">
          <AnimatedSection>
            <h2 className="section-title">{t.home.ourObjectives}</h2>
            <div className="gold-line mb-12" />
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {objectives.map((o, i) => (
              <AnimatedSection key={o.title} delay={i * 0.1}>
                <div className="card-hover h-full">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <o.icon className="text-accent" size={28} />
                  </div>
                  <p className="text-sm font-medium">{o.title}</p>
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
            <h2 className="section-title">{t.home.threePillars}</h2>
            <div className="gold-line mb-12" />
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pillars.map((p, i) => (
              <AnimatedSection key={p.title} delay={i * 0.15}>
                <div className="card-hover h-full">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <p.icon className="text-primary" size={30} />
                  </div>
                  <h3 className="text-xl font-serif font-semibold mb-3">{p.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OUR STORY PREVIEW ─── */}
      <section className="py-20">
        <div className="section-container max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">{t.home.ourStory}</p>
            <h2 className="section-title mb-6">{t.home.millerLegacy}</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {t.home.storyText}
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
              <h2 className="section-title mb-0">{t.home.impactInAction}</h2>
            </div>
            <p className="section-subtitle">{t.home.impactSub}</p>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <MediaCarousel />
          </AnimatedSection>
        </div>
      </section>

      {/* ─── REALISATIONS ─── */}
      <section className="py-20">
        <div className="section-container max-w-3xl mx-auto">
          <AnimatedSection>
            <h2 className="section-title">{t.home.keyAchievements}</h2>
            <div className="gold-line mb-12" />
          </AnimatedSection>
          <div className="space-y-4">
            {realisations.map((r, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="flex items-start gap-4 p-5 bg-card border border-border rounded-lg hover:shadow-md transition-shadow">
                  <CheckCircle className="text-accent flex-shrink-0 mt-0.5" size={22} />
                  <p className="text-sm font-medium">{r}</p>
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
      <section className="py-20 bg-surface">
        <div className="section-container">
          <AnimatedSection>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Handshake className="text-accent" size={24} />
              <h2 className="section-title mb-0">{t.home.ourPartners}</h2>
            </div>
            <p className="section-subtitle">{t.home.partnersSub}</p>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6 max-w-4xl mx-auto">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-card border border-border rounded-xl flex items-center justify-center hover:shadow-md transition-shadow">
                  <div className="text-muted-foreground/30 text-xs uppercase tracking-wider font-medium">
                    Partner {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── QUOTE ─── */}
      <section className="navy-section">
        <div className="section-container max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <div className="gold-line mb-8" />
            <p className="text-2xl md:text-3xl font-serif italic text-primary-foreground leading-relaxed">
              {t.home.quote}
            </p>
            <div className="gold-line mt-8" />
            <p className="mt-6 text-sm font-semibold text-accent uppercase tracking-wider">{t.home.mullersFoundation}</p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Home;
