import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Briefcase, MapPin, ListChecks, ArrowRight, Megaphone } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/integrations/supabase/client";

type VolunteerPosition = {
  id: string;
  title: string;
  title_fr: string | null;
  description: string | null;
  description_fr: string | null;
  criteria: string | null;
  criteria_fr: string | null;
  location: string | null;
};

const Volunteer = () => {
  const { lang } = useLanguage();
  useSEO("Rejoignez notre équipe — Appel à volontariat", "Muller's Foundation (MUFO) recrute des bénévoles à Kinshasa, RDC.");

  const { data: positions = [], isLoading } = useQuery({
    queryKey: ["volunteer_positions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("volunteer_positions")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as VolunteerPosition[];
    },
  });

  const localized = (en: string | null, fr: string | null) => (lang === "fr" && fr ? fr : en ?? "");

  return (
    <div>
      <section className="navy-section pt-28 pb-16 text-center">
        <div className="section-container">
          <AnimatedSection>
            <Megaphone className="mx-auto text-accent mb-4" size={40} />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground">
              {lang === "fr" ? "Appel à Volontariat" : "Call for Volunteers"}
            </h1>
            <p className="mt-4 text-primary-foreground/70 max-w-2xl mx-auto">
              {lang === "fr"
                ? "Rejoignez notre équipe et donnez du sens à votre engagement en soutenant nos programmes à Kinshasa, RDC."
                : "Join our team and put your commitment to work supporting our programs in Kinshasa, DR Congo."}
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20">
        <div className="section-container max-w-4xl mx-auto">
          {isLoading ? (
            <p className="text-center text-muted-foreground">{lang === "fr" ? "Chargement..." : "Loading..."}</p>
          ) : positions.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {lang === "fr" ? "Aucun poste ouvert pour le moment." : "No open positions at the moment."}
            </p>
          ) : (
            <div className="space-y-6">
              {positions.map((p, i) => (
                <AnimatedSection key={p.id} delay={i * 0.08}>
                  <div className="bg-card border border-border rounded-2xl shadow-md overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-gold-dark via-accent to-gold-light" />
                    <div className="p-6 sm:p-8">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-md flex items-center justify-center flex-shrink-0">
                            <Briefcase className="text-white" size={18} strokeWidth={1.75} />
                          </div>
                          <h2 className="text-lg font-serif font-bold">{localized(p.title, p.title_fr)}</h2>
                        </div>
                        {p.location && (
                          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-surface px-3 py-1.5 rounded-full">
                            <MapPin size={13} /> {p.location}
                          </span>
                        )}
                      </div>

                      {localized(p.description, p.description_fr) && (
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                          {localized(p.description, p.description_fr)}
                        </p>
                      )}

                      {localized(p.criteria, p.criteria_fr) && (
                        <div className="bg-surface rounded-xl p-4 flex items-start gap-3">
                          <ListChecks className="text-accent flex-shrink-0 mt-0.5" size={18} />
                          <p className="text-sm text-foreground leading-relaxed">
                            {localized(p.criteria, p.criteria_fr)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          <AnimatedSection delay={0.2}>
            <div className="mt-12 text-center bg-surface rounded-2xl p-8">
              <h3 className="text-xl font-serif font-bold mb-2">
                {lang === "fr" ? "Prêt(e) à postuler ?" : "Ready to apply?"}
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                {lang === "fr"
                  ? "Envoyez-nous votre CV et une lettre de motivation via notre formulaire de contact."
                  : "Send us your CV and a cover letter through our contact form."}
              </p>
              <Link to="/contact">
                <Button variant="gold" className="gap-2">
                  {lang === "fr" ? "Postuler maintenant" : "Apply now"} <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Volunteer;
