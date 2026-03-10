import AnimatedSection from "@/components/AnimatedSection";
import Counter from "@/components/Counter";
import { BookOpen, HeartPulse, Users, Star } from "lucide-react";

const timeline = [
  { year: "2021", title: "Foundation Established", desc: "MUFO was founded in Kinshasa, DR Congo, with a vision to transform communities through structured humanitarian action.", icon: Star },
  { year: "2023", title: "Educational Support", desc: "Launched comprehensive educational programs supporting over 2,000 children with materials, mentorship, and school rehabilitation assessments.", icon: BookOpen },
  { year: "2024", title: "Community Health Campaign", desc: "Deployed health awareness and access programs across underserved regions, reaching thousands of families.", icon: HeartPulse },
  { year: "2025", title: "Youth Empowerment Project", desc: "Initiated skill-building and leadership development for young adults, with pilot programs in entrepreneurship.", icon: Users },
];

const Activities = () => (
  <div>
    <section className="page-hero">
      <div className="section-container">
        <h1 className="page-hero-title">Our Activities</h1>
        <div className="gold-line mt-6" />
        <p className="page-hero-subtitle mt-6">Measurable impact through structured, community-driven programs.</p>
      </div>
    </section>

    <section className="navy-section">
      <div className="section-container grid grid-cols-2 md:grid-cols-4 gap-10">
        <Counter end={4000} suffix="+" label="Children Supported" />
        <Counter end={19} label="Field Actions" />
        <Counter end={3} suffix="+" label="Areas Reached" />
        <Counter end={2021} label="Founded" />
      </div>
    </section>

    <section className="py-20">
      <div className="section-container max-w-3xl mx-auto">
        <AnimatedSection>
          <h2 className="section-title">Our Journey</h2>
          <div className="gold-line mb-16" />
        </AnimatedSection>
        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />
          {timeline.map((item, i) => (
            <AnimatedSection key={item.year} delay={i * 0.15}>
              <div className={`relative flex items-start gap-6 mb-14 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-surface border-2 border-primary flex items-center justify-center z-10">
                  <item.icon className="text-primary" size={20} />
                </div>
                <div className={`ml-20 md:ml-0 md:w-[calc(50%-3rem)] ${i % 2 === 0 ? "" : "md:text-right"}`}>
                  <span className="text-sm font-bold text-accent">{item.year}</span>
                  <h3 className="text-xl font-serif font-semibold mt-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* Project cards placeholder */}
    <section className="py-20 bg-surface">
      <div className="section-container">
        <AnimatedSection>
          <h2 className="section-title">Project Highlights</h2>
          <div className="gold-line mb-12" />
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {["Education Initiative", "Health Campaign", "Youth Program"].map((title, i) => (
            <AnimatedSection key={title} delay={i * 0.1}>
              <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center">
                  <span className="text-muted-foreground/40 text-xs uppercase">Photo</span>
                </div>
                <div className="p-6">
                  <h3 className="font-serif font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">Structured program delivering measurable impact in communities across the region.</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Activities;
