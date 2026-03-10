import AnimatedSection from "@/components/AnimatedSection";
import { BookOpen, Award, Heart, Stethoscope, Lightbulb, Shield, Scale, Gem } from "lucide-react";

const values = [
  { icon: Heart, name: "Compassion", desc: "Driven by empathy for those in need" },
  { icon: Shield, name: "Integrity", desc: "Transparency in all operations" },
  { icon: Award, name: "Excellence", desc: "Highest standards of impact" },
  { icon: Scale, name: "Equity", desc: "Equal opportunity for all" },
  { icon: Gem, name: "Legacy", desc: "Building generational change" },
];

const History = () => (
  <div>
    <section className="page-hero">
      <div className="section-container">
        <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">About MUFO</p>
        <h1 className="page-hero-title">Our History</h1>
        <div className="gold-line mt-6" />
        <p className="page-hero-subtitle mt-6">The origin and evolution of Muller's Foundation.</p>
      </div>
    </section>

    <section className="py-20">
      <div className="section-container max-w-3xl mx-auto">
        <AnimatedSection>
          <h2 className="text-3xl font-serif font-bold mb-6 text-center">The Meaning Behind the Name</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The name "Muller" — meaning "miller" — embodies the foundation's core philosophy. Just as a miller transforms raw grain into nourishing flour, Muller's Foundation transforms untapped human potential into sustainable opportunity.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            This metaphor guides every decision, program, and partnership we undertake. We don't simply provide aid — we create the conditions for lasting transformation.
          </p>
        </AnimatedSection>
      </div>
    </section>

    <section className="py-20 bg-surface">
      <div className="section-container grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="card-hover text-left">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="text-primary" size={24} />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-3">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              Restore hope and build a generational legacy where every community has the resources and opportunity to thrive.
            </p>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <div className="card-hover text-left">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Award className="text-accent" size={24} />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-3">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              Transform potential into sustainable opportunity through education, health, and community development programs.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>

    <section className="py-20">
      <div className="section-container">
        <AnimatedSection>
          <h2 className="section-title">Three Core Pillars</h2>
          <div className="gold-line mb-12" />
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: Heart, title: "Humanitarian Identity", desc: "A deep commitment to serving vulnerable communities with dignity and respect." },
            { icon: Stethoscope, title: "Professional Approach", desc: "Structured, accountable, and results-driven methodology in all field operations." },
            { icon: Lightbulb, title: "Spiritual Dimension", desc: "Guided by faith, purpose, and the belief in the inherent worth of every individual." },
          ].map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.15}>
              <div className="card-hover h-full">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
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

    <section className="py-20 bg-surface">
      <div className="section-container">
        <AnimatedSection>
          <h2 className="section-title">Core Values</h2>
          <div className="gold-line mb-12" />
        </AnimatedSection>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {values.map((v, i) => (
            <AnimatedSection key={v.name} delay={i * 0.1}>
              <div className="card-hover h-full">
                <v.icon className="text-accent mx-auto mb-3" size={28} />
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

export default History;
