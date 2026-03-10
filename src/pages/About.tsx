import { Heart, Shield, Award, Scale, Gem, BookOpen, Stethoscope, Lightbulb } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const values = [
  { icon: Heart, name: "Compassion", desc: "Driven by empathy for those in need" },
  { icon: Shield, name: "Integrity", desc: "Transparency in all operations" },
  { icon: Award, name: "Excellence", desc: "Highest standards of impact" },
  { icon: Scale, name: "Equity", desc: "Equal opportunity for all" },
  { icon: Gem, name: "Legacy", desc: "Building generational change" },
];

const pillars = [
  { icon: Heart, title: "Humanitarian Identity", desc: "A deep commitment to serving vulnerable communities with dignity and respect." },
  { icon: Stethoscope, title: "Professional Approach", desc: "Structured, accountable, and results-driven methodology in all field operations." },
  { icon: Lightbulb, title: "Spiritual Dimension", desc: "Guided by faith, purpose, and the belief in the inherent worth of every individual." },
];

const About = () => (
  <div>
    <section className="page-hero">
      <div className="section-container">
        <h1 className="page-hero-title">About Muller's Foundation</h1>
        <p className="page-hero-subtitle">Restoring hope and building generational legacy since 2021.</p>
      </div>
    </section>

    {/* Our Story */}
    <section className="py-20">
      <div className="section-container max-w-3xl mx-auto">
        <AnimatedSection>
          <h2 className="text-3xl font-serif font-bold mb-6 text-center">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The name "Muller" — meaning "miller" — embodies the foundation's core philosophy. Just as a miller transforms raw grain into nourishing flour, Muller's Foundation transforms untapped human potential into sustainable opportunity.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Founded in 2021 in Kinshasa, DR Congo, MUFO was born from a profound conviction: that every individual, regardless of circumstance, possesses the potential for greatness. Our work spans education, health, and community development across multiple regions.
          </p>
        </AnimatedSection>
      </div>
    </section>

    {/* Vision & Mission */}
    <section className="py-20 bg-muted">
      <div className="section-container grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="w-12 h-12 bg-green-light rounded-full flex items-center justify-center mb-4">
              <BookOpen className="text-primary" size={24} />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-3">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              Restore hope and build a generational legacy where every community has the resources and opportunity to thrive.
            </p>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="w-12 h-12 bg-gold-light rounded-full flex items-center justify-center mb-4">
              <Award className="text-gold" size={24} />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-3">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              Transform potential into sustainable opportunity through education, health, and community development programs.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* Three Core Pillars */}
    <section className="py-20">
      <div className="section-container">
        <AnimatedSection>
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Three Core Pillars</h2>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pillars.map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.15}>
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-green-light flex items-center justify-center mx-auto mb-4">
                  <p.icon className="text-primary" size={28} />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-3">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* Core Values */}
    <section className="py-20 bg-muted">
      <div className="section-container">
        <AnimatedSection>
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Core Values</h2>
        </AnimatedSection>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {values.map((v, i) => (
            <AnimatedSection key={v.name} delay={i * 0.1}>
              <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <v.icon className="text-gold mx-auto mb-3" size={28} />
                <h4 className="font-serif font-semibold mb-1">{v.name}</h4>
                <p className="text-xs text-muted-foreground">{v.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default About;
