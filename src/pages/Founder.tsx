import AnimatedSection from "@/components/AnimatedSection";
import founderImg from "@/assets/founder.jpg";

const quotes = [
  "True leadership is measured not by power, but by the lives you transform.",
  "Legacy is not what you leave for people — it's what you leave in them.",
];

const Founder = () => (
  <div>
    <section className="page-hero">
      <div className="section-container">
        <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">About MUFO</p>
        <h1 className="page-hero-title">Our Founder</h1>
        <div className="gold-line mt-6" />
        <p className="page-hero-subtitle mt-6">Visionary leadership building lasting impact.</p>
      </div>
    </section>

    <section className="py-20">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="relative">
              <img
                src={founderImg}
                alt="Kevin J. Kapuku – Founder & CEO"
                className="rounded-xl shadow-2xl w-full max-w-md mx-auto"
              />
              <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-accent/15 rounded-xl -z-10" />
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary/10 rounded-xl -z-10" />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2">Kevin J. Kapuku</h2>
              <p className="text-accent font-semibold mb-8 uppercase tracking-wider text-sm">Founder & Chief Executive Officer</p>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Kevin J. Kapuku is the visionary founder of Muller's Foundation (MUFO), an organization born from his deep conviction that every human being carries within them the seed of transformation.
                </p>
                <p>
                  With a background in international development and community leadership, Kevin has dedicated his career to bridging the gap between potential and opportunity in underserved communities across Africa.
                </p>
                <p>
                  His leadership philosophy centers on discipline, compassion, and sustainable impact — principles that guide every initiative MUFO undertakes.
                </p>
                <p>
                  Under his direction, MUFO has supported over 4,000 children, launched 19 field actions, and expanded operations across multiple regions since its founding in 2021.
                </p>
              </div>

              <div className="mt-10 space-y-4">
                {quotes.map((q, i) => (
                  <div key={i} className="gold-border-box">
                    <p className="font-serif italic text-foreground">"{q}"</p>
                    <p className="text-xs text-accent mt-2 font-semibold">— Kevin J. Kapuku</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  </div>
);

export default Founder;
