import AnimatedSection from "@/components/AnimatedSection";
import Counter from "@/components/Counter";
import { BookOpen, HeartPulse, Users, Star } from "lucide-react";

const timeline = [
  { year: "2021", title: "Foundation Established", desc: "MUFO was founded in Kinshasa, DR Congo, with a vision to transform communities.", icon: Star },
  { year: "2023", title: "Educational Support", desc: "Launched comprehensive educational programs supporting over 2,000 children.", icon: BookOpen },
  { year: "2024", title: "Community Health Campaign", desc: "Deployed health awareness and access programs across underserved regions.", icon: HeartPulse },
  { year: "2025", title: "Youth Empowerment Project", desc: "Initiated skill-building and leadership development for young adults.", icon: Users },
];

const Activities = () => (
  <div>
    <section className="page-hero">
      <div className="section-container">
        <h1 className="page-hero-title">Our Activities</h1>
        <p className="page-hero-subtitle">Measurable impact through structured, community-driven programs.</p>
      </div>
    </section>

    {/* Impact Numbers */}
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="section-container grid grid-cols-2 md:grid-cols-4 gap-8">
        <Counter end={4000} suffix="+" label="Children Supported" />
        <Counter end={19} label="Field Actions" />
        <Counter end={3} suffix="+" label="Areas Reached" />
        <Counter end={2021} label="Founded" />
      </div>
    </section>

    {/* Timeline */}
    <section className="py-20">
      <div className="section-container max-w-3xl mx-auto">
        <AnimatedSection>
          <h2 className="text-3xl font-serif font-bold text-center mb-16">Our Journey</h2>
        </AnimatedSection>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          {timeline.map((item, i) => (
            <AnimatedSection key={item.year} delay={i * 0.15}>
              <div className={`relative flex items-start gap-6 mb-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-green-light border-2 border-primary flex items-center justify-center z-10">
                  <item.icon className="text-primary" size={20} />
                </div>
                {/* Content */}
                <div className={`ml-20 md:ml-0 md:w-[calc(50%-3rem)] ${i % 2 === 0 ? "" : "md:text-right"}`}>
                  <span className="text-sm font-bold text-gold">{item.year}</span>
                  <h3 className="text-xl font-serif font-semibold mt-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{item.desc}</p>
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
