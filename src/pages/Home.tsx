import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, HeartPulse, Users, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import Counter from "@/components/Counter";
import heroBg from "@/assets/hero-bg.jpg";

const pillars = [
  { icon: BookOpen, title: "Education", desc: "Empowering the next generation through quality education and mentorship programs." },
  { icon: HeartPulse, title: "Community Health", desc: "Delivering essential healthcare access and awareness to underserved communities." },
  { icon: Users, title: "Philanthropy & Development", desc: "Building sustainable community infrastructure and economic opportunity." },
];

const Home = () => (
  <div>
    {/* Hero */}
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="Children in classroom" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-green-dark/70" />
      </div>
      <div className="relative z-10 section-container text-center text-primary-foreground py-20">
        <AnimatedSection>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight max-w-4xl mx-auto">
            Together, We Restore Hope and Build a Lasting Legacy
          </h1>
          <p className="mt-6 text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Transforming potential into sustainable opportunity since 2021.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/donate">
              <Button variant="gold" size="lg" className="text-base px-8">Make a Donation</Button>
            </Link>
            <Link to="/membership">
              <Button size="lg" className="text-base px-8 bg-primary-foreground/20 backdrop-blur border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/30">
                Become a Member
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* Counters */}
    <section className="py-16 bg-green-light">
      <div className="section-container grid grid-cols-2 md:grid-cols-4 gap-8">
        <Counter end={4000} suffix="+" label="Children Supported" />
        <Counter end={19} label="Field Actions" />
        <Counter end={3} suffix="+" label="Areas Reached" />
        <Counter end={2021} label="Founded" />
      </div>
    </section>

    {/* Pillars */}
    <section className="py-20">
      <div className="section-container">
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">Our Three Pillars</h2>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.15}>
              <div className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow h-full">
                <div className="w-14 h-14 rounded-full bg-green-light flex items-center justify-center mx-auto mb-4">
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

    {/* Our Story Preview */}
    <section className="py-20 bg-muted">
      <div className="section-container max-w-3xl text-center">
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            The name "Muller" — the miller — symbolizes transformation: turning raw grain into nourishing flour.
            Like the miller, Muller's Foundation transforms untapped potential into lasting opportunity for communities across Africa.
          </p>
          <Link to="/about">
            <Button variant="outline" className="gap-2">
              Learn More <ArrowRight size={16} />
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>

    {/* Quote */}
    <section className="py-20">
      <div className="section-container max-w-3xl mx-auto">
        <AnimatedSection>
          <div className="gold-border-box text-center">
            <p className="text-xl md:text-2xl font-serif italic text-foreground leading-relaxed">
              "Compassion inspires our mission. Discipline guarantees impact. Legacy is built together."
            </p>
            <p className="mt-4 text-sm font-semibold text-gold">— Muller's Foundation</p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  </div>
);

export default Home;
