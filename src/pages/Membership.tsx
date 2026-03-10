import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Standard Member",
    desc: "Support our mission and stay connected.",
    benefits: ["Quarterly newsletter", "Annual impact report", "Invitation to events", "Certificate of membership"],
    featured: false,
  },
  {
    name: "Supporter Member",
    desc: "Amplify your impact with deeper engagement.",
    benefits: ["All Standard benefits", "Priority event access", "Recognition on website", "Direct project updates", "Exclusive webinars"],
    featured: true,
  },
  {
    name: "Ambassador Member",
    desc: "Lead alongside us as a champion of change.",
    benefits: ["All Supporter benefits", "Advisory board invitation", "Field visit opportunities", "Personal impact dashboard", "VIP recognition events", "Co-branding opportunities"],
    featured: false,
  },
];

const Membership = () => (
  <div>
    <section className="page-hero">
      <div className="section-container">
        <h1 className="page-hero-title">Become a Member</h1>
        <p className="page-hero-subtitle">Join a global community committed to lasting change.</p>
      </div>
    </section>

    <section className="py-20">
      <div className="section-container">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((t, i) => (
            <AnimatedSection key={t.name} delay={i * 0.15}>
              <div className={`rounded-lg p-8 h-full flex flex-col ${t.featured ? "bg-primary text-primary-foreground ring-2 ring-gold shadow-xl scale-105" : "bg-card border border-border"}`}>
                {t.featured && <span className="text-xs font-bold bg-gold text-foreground px-3 py-1 rounded-full self-start mb-4">Most Popular</span>}
                <h3 className="text-xl font-serif font-bold mb-2">{t.name}</h3>
                <p className={`text-sm mb-6 ${t.featured ? "opacity-80" : "text-muted-foreground"}`}>{t.desc}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {t.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm">
                      <Check size={16} className={`mt-0.5 flex-shrink-0 ${t.featured ? "text-gold" : "text-primary"}`} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={t.featured ? "gold" : "default"} className="w-full">Join Now</Button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Membership;
