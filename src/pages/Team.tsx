import { useQuery } from "@tanstack/react-query";
import AnimatedSection from "@/components/AnimatedSection";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSEO } from "@/hooks/useSEO";

const Team = () => {
  useSEO("Our Team", "Meet the dedicated team behind Muller's Foundation (MUFO).");
  const { data: teamMembers = [] } = useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <section className="page-hero">
        <div className="section-container">
          <h1 className="page-hero-title">Our Team</h1>
          <p className="page-hero-subtitle">Dedicated professionals united by a shared commitment to impact.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="section-container">
          {teamMembers.length === 0 ? (
            <p className="text-center text-muted-foreground">Team information coming soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {teamMembers.map((m, i) => (
                <AnimatedSection key={m.id} delay={i * 0.1}>
                  <div className={`bg-card border rounded-lg p-6 text-center hover:shadow-lg transition-shadow ${m.is_leadership ? "border-gold border-2 ring-2 ring-gold/20" : "border-border"}`}>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden ${m.is_leadership ? "bg-gold/20" : "bg-green-light"}`}>
                      {m.photo_url ? (
                        <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <User className={m.is_leadership ? "text-gold" : "text-primary"} size={32} />
                      )}
                    </div>
                    <h3 className="text-lg font-serif font-semibold">{m.name}</h3>
                    <p className={`text-sm font-medium mb-3 ${m.is_leadership ? "text-gold" : "text-primary"}`}>{m.role}</p>
                    {m.bio && <p className="text-sm text-muted-foreground">{m.bio}</p>}
                    {m.is_leadership && <span className="inline-block mt-3 text-xs font-semibold bg-gold/10 text-gold px-3 py-1 rounded-full">Leadership</span>}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          <AnimatedSection delay={0.4}>
            <div className="mt-16 max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-serif font-bold mb-4">Governance & Transparency</h3>
              <p className="text-muted-foreground leading-relaxed">
                MUFO is governed by a commitment to full transparency and accountability. Every team member upholds our core values of integrity, compassion, and excellence in serving communities.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Team;
