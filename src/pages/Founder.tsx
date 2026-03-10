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
        <h1 className="page-hero-title">Our Founder</h1>
        <p className="page-hero-subtitle">Visionary leadership building lasting impact.</p>
      </div>
    </section>

    <section className="py-20">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="relative">
              <img
                src={founderImg}
                alt="Kevin J. Kapuku – Founder & CEO"
                className="rounded-lg shadow-lg w-full max-w-md mx-auto"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold/20 rounded-lg -z-10" />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2">Kevin J. Kapuku</h2>
              <p className="text-gold font-semibold mb-6">Founder & Chief Executive Officer</p>

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

              <div className="mt-8 space-y-4">
                {quotes.map((q, i) => (
                  <div key={i} className="gold-border-box">
                    <p className="font-serif italic text-foreground">"{q}"</p>
                    <p className="text-xs text-gold mt-2 font-semibold">— Kevin J. Kapuku</p>
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
