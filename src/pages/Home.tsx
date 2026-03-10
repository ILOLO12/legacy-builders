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

const pillars = [
  { icon: BookOpen, title: "Education", desc: "Empowering children and youth through quality education and mentorship programs." },
  { icon: HeartPulse, title: "Community Health", desc: "Delivering essential healthcare services and awareness to underserved communities." },
  { icon: Users, title: "Philanthropy & Development", desc: "Building strong community foundations through sustainable development initiatives." },
];

const objectives = [
  { icon: GraduationCap, title: "Expand access to quality education" },
  { icon: Stethoscope, title: "Promote equitable healthcare" },
  { icon: Lightbulb, title: "Empower youth through entrepreneurship" },
  { icon: Shield, title: "Strengthen local community resilience" },
];

const realisations = [
  "Educational materials distributed to 4,000+ children",
  "School rehabilitation assessments in 3 regions",
  "Community health campaigns reaching thousands",
  "Youth empowerment planning and pilot programs",
];

const Home = () => (
  <div>
    {/* ─── HERO ─── */}
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="Children in classroom" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy-dark/75" />
      </div>
      <div className="relative z-10 section-container text-center text-primary-foreground py-20">
        <AnimatedSection>
          <div className="gold-line mb-8" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight max-w-4xl mx-auto">
            Together, We Restore Hope and Build a Lasting Legacy
          </h1>
          <p className="mt-6 text-lg md:text-xl opacity-80 max-w-2xl mx-auto font-light">
            Transforming potential into sustainable opportunity since 2021.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/founder">
              <Button variant="hero-outline" size="lg" className="text-base px-8">
                Learn More
              </Button>
            </Link>
            <Link to="/donate">
              <Button variant="gold" size="lg" className="text-base px-8">
                Donate
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* ─── IMPACT COUNTERS ─── */}
    <section className="navy-section">
      <div className="section-container grid grid-cols-2 md:grid-cols-4 gap-10">
        <Counter end={4000} suffix="+" label="Children Supported" />
        <Counter end={19} label="Field Actions" />
        <Counter end={3} suffix="+" label="Areas Reached" />
        <Counter end={2021} label="Founded" />
      </div>
    </section>

    {/* ─── WHO WE ARE ─── */}
    <section className="py-20">
      <div className="section-container max-w-3xl mx-auto text-center">
        <AnimatedSection>
          <h2 className="section-title">Who We Are</h2>
          <div className="gold-line mb-8" />
          <p className="text-muted-foreground leading-relaxed mb-8">
            Muller's Foundation (MUFO) is an international humanitarian organization founded in 2021 and headquartered in Kinshasa, Democratic Republic of Congo. We operate through structured programs in education, community health, and sustainable development to empower vulnerable communities and transform generational trajectories.
          </p>
          <Link to="/history">
            <Button variant="outline" className="gap-2">
              Discover Our Story <ArrowRight size={16} />
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>

    {/* ─── OUR MISSION ─── */}
    <section className="py-20 bg-surface">
      <div className="section-container max-w-3xl mx-auto text-center">
        <AnimatedSection>
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Our Mission</p>
          <h2 className="text-2xl md:text-3xl font-serif font-bold leading-relaxed">
            To transform untapped potential into sustainable opportunity by delivering structured, measurable and ethical interventions in education, health, and community development.
          </h2>
        </AnimatedSection>
      </div>
    </section>

    {/* ─── OUR OBJECTIVES ─── */}
    <section className="py-20">
      <div className="section-container">
        <AnimatedSection>
          <h2 className="section-title">Our Objectives</h2>
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
          <h2 className="section-title">Our Three Pillars</h2>
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
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-4">Our Story</p>
          <h2 className="section-title mb-6">The Miller's Legacy</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            The name "Muller" — the miller — symbolizes the transformation of raw grain into nourishing flour. In the same way, MUFO transforms untapped human potential into sustainable opportunity, one community at a time.
          </p>
          <Link to="/history">
            <Button variant="outline" className="gap-2">
              Learn More <ArrowRight size={16} />
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
            <h2 className="section-title mb-0">Impact in Action</h2>
          </div>
          <p className="section-subtitle">Photos and videos from our field operations</p>
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
          <h2 className="section-title">Key Achievements</h2>
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
              View All Activities <ArrowRight size={16} />
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
            <h2 className="section-title mb-0">Our Partners</h2>
          </div>
          <p className="section-subtitle">Working together for sustainable impact.</p>
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
            "Compassion inspires our mission. Discipline guarantees impact. Legacy is built together."
          </p>
          <div className="gold-line mt-8" />
          <p className="mt-6 text-sm font-semibold text-accent uppercase tracking-wider">Muller's Foundation</p>
        </AnimatedSection>
      </div>
    </section>
  </div>
);

export default Home;
