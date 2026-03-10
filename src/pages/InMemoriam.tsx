import AnimatedSection from "@/components/AnimatedSection";
import { Shield, Heart, Mountain, Users } from "lucide-react";
import memorialImg from "@/assets/memorial.jpg";

const values = [
  { icon: Shield, name: "Responsibility" },
  { icon: Heart, name: "Dignity" },
  { icon: Mountain, name: "Perseverance" },
  { icon: Users, name: "Generational Impact" },
];

const InMemoriam = () => (
  <div>
    <section className="page-hero bg-muted">
      <div className="section-container">
        <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">About MUFO</p>
        <h1 className="page-hero-title">In Memoriam</h1>
        <div className="gold-line mt-6" />
        <p className="page-hero-subtitle mt-6">A tribute to the legacy that inspires our mission.</p>
      </div>
    </section>

    <section className="py-20">
      <div className="section-container max-w-4xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="w-48 h-48 rounded-full overflow-hidden mx-auto mb-6 border-4 border-accent/30 shadow-xl">
              <img src={memorialImg} alt="Joseph Marcellin Kapuku" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2">Joseph Marcellin Kapuku</h2>
            <p className="text-accent font-semibold uppercase tracking-wider text-sm">In Honor of His Legacy</p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="max-w-2xl mx-auto text-center space-y-4 text-muted-foreground leading-relaxed mb-16">
            <p>
              Joseph Marcellin Kapuku embodied the values that Muller's Foundation holds most dear. His life was a testament to the power of perseverance, dignity, and unwavering commitment to family and community.
            </p>
            <p>
              His legacy lives on through every child educated, every community served, and every life transformed by the foundation that bears his family name.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <h3 className="text-2xl font-serif font-bold text-center mb-8">Values He Embodied</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.name} className="card-hover">
                <v.icon className="text-accent mx-auto mb-3" size={32} />
                <p className="font-serif font-semibold text-sm">{v.name}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <div className="mt-16 gold-border-box text-center max-w-xl mx-auto">
            <p className="font-serif italic text-foreground text-lg">
              "A life well-lived echoes through generations."
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  </div>
);

export default InMemoriam;
