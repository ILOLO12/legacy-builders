import { useQuery } from "@tanstack/react-query";
import AnimatedSection from "@/components/AnimatedSection";
import Counter from "@/components/Counter";
import {
  BookOpen, HeartPulse, Users, Star, Award, Heart, Lightbulb, Shield,
  Scale, Gem, GraduationCap, Stethoscope, Handshake, Newspaper, type LucideIcon,
  CalendarDays, MapPin,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { localeFor } from "@/i18n/locale";
import { useSEO } from "@/hooks/useSEO";
import { usePageContent } from "@/hooks/usePageContent";
import { supabase } from "@/integrations/supabase/client";

const ICONS: Record<string, LucideIcon> = {
  BookOpen, HeartPulse, Users, Star, Award, Heart, Lightbulb, Shield,
  Scale, Gem, GraduationCap, Stethoscope, Handshake, Newspaper,
};

const resolveIcon = (name: string | null) => ICONS[name ?? ""] ?? Star;

const Activities = () => {
  const { t, lang } = useLanguage();
  useSEO("Our Activities", "Explore MUFO's timeline, field projects, and community impact.");
  const c = usePageContent("home", t.home);

  const { data: activities = [] } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const { data, error } = await supabase.from("activities").select("*").order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").order("event_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const timeline = activities.filter((a) => a.category === "timeline");
  const projects = activities.filter((a) => a.category === "project");

  const localized = (en: string | null, fr: string | null) => (lang === "fr" && fr ? fr : en ?? "");

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
          <Counter end={4000} suffix="+" label={c.childrenSupported} />
          <Counter end={19} label={c.fieldActions} />
          <Counter end={3} suffix="+" label={c.areasReached} />
          <Counter end={2021} label={c.founded} />
        </div>
      </section>

      <section className="py-20">
        <div className="section-container max-w-3xl mx-auto">
          <AnimatedSection>
            <h2 className="section-title">{t.activities.ourJourney}</h2>
            <div className="gold-line mb-16" />
          </AnimatedSection>
          {timeline.length === 0 ? (
            <p className="text-center text-muted-foreground">{lang === "fr" ? "À venir." : "Coming soon."}</p>
          ) : (
            <div className="relative">
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />
              {timeline.map((item, i) => {
                const Icon = resolveIcon(item.icon);
                return (
                  <AnimatedSection key={item.id} delay={i * 0.15}>
                    <div className={`relative flex items-start gap-6 mb-14 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-surface border-2 border-primary flex items-center justify-center z-10">
                        <Icon className="text-primary" size={20} />
                      </div>
                      <div className={`ml-20 md:ml-0 md:w-[calc(50%-3rem)] ${i % 2 === 0 ? "" : "md:text-right"}`}>
                        {item.year && <span className="text-sm font-bold text-accent">{item.year}</span>}
                        <h3 className="text-xl font-serif font-semibold mt-1">{localized(item.title, item.title_fr)}</h3>
                        <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{localized(item.description, item.description_fr)}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="section-container">
          <AnimatedSection>
            <h2 className="section-title">{t.activities.projectHighlights}</h2>
            <div className="gold-line mb-12" />
          </AnimatedSection>
          {projects.length === 0 ? (
            <p className="text-center text-muted-foreground">{lang === "fr" ? "À venir." : "Coming soon."}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {projects.map((p, i) => (
                <AnimatedSection key={p.id} delay={i * 0.1}>
                  <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center overflow-hidden">
                      {p.image_url ? (
                        <img src={p.image_url} alt={localized(p.title, p.title_fr)} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <span className="text-muted-foreground/40 text-xs uppercase">Photo</span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif font-semibold mb-2">{localized(p.title, p.title_fr)}</h3>
                      <p className="text-sm text-muted-foreground">{localized(p.description, p.description_fr)}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {events.length > 0 && (
        <section className="py-20">
          <div className="section-container">
            <AnimatedSection>
              <div className="flex items-center justify-center gap-3 mb-4">
                <CalendarDays className="text-accent" size={24} />
                <h2 className="section-title mb-0">{lang === "fr" ? "Événements à venir" : "Upcoming Events"}</h2>
              </div>
              <div className="gold-line mb-12" />
            </AnimatedSection>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {events.map((ev, i) => (
                <AnimatedSection key={ev.id} delay={i * 0.1}>
                  <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center overflow-hidden">
                      {ev.image_url ? (
                        <img src={ev.image_url} alt={localized(ev.title, ev.title_fr)} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <CalendarDays className="text-primary/30" size={32} />
                      )}
                    </div>
                    <div className="p-6">
                      {ev.event_date && (
                        <div className="flex items-center gap-2 text-accent text-xs font-semibold mb-2">
                          <CalendarDays size={14} />
                          <time>{new Date(ev.event_date).toLocaleDateString(localeFor(lang), { year: "numeric", month: "long", day: "numeric" })}</time>
                        </div>
                      )}
                      <h3 className="font-serif font-semibold mb-2">{localized(ev.title, ev.title_fr)}</h3>
                      {ev.location && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                          <MapPin size={12} /> {ev.location}
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground">{localized(ev.description, ev.description_fr)}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Activities;
