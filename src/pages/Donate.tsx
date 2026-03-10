import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import { CreditCard, Smartphone, Globe, DollarSign } from "lucide-react";

const methods = [
  { icon: CreditCard, name: "Bank Transfer", desc: "Direct bank wire to our institutional account." },
  { icon: Smartphone, name: "Mobile Money", desc: "Quick transfer via M-Pesa, Orange Money, or Airtel Money." },
  { icon: Globe, name: "PayPal", desc: "Secure online payment via PayPal." },
  { icon: DollarSign, name: "Zelle", desc: "Instant transfer through Zelle (US)." },
];

const allocation = [
  { label: "Education", pct: 60, color: "bg-primary" },
  { label: "Health", pct: 25, color: "bg-gold" },
  { label: "Philanthropy", pct: 10, color: "bg-green-dark" },
  { label: "Administration", pct: 5, color: "bg-muted-foreground" },
];

const Donate = () => (
  <div>
    <section className="page-hero bg-primary text-primary-foreground">
      <div className="section-container">
        <h1 className="page-hero-title text-primary-foreground">Each Donation Transforms a Life</h1>
        <p className="page-hero-subtitle text-primary-foreground/80">Your generosity directly impacts children, families, and communities.</p>
      </div>
    </section>

    {/* Methods */}
    <section className="py-20">
      <div className="section-container">
        <AnimatedSection>
          <h2 className="text-3xl font-serif font-bold text-center mb-12">How to Donate</h2>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {methods.map((m, i) => (
            <AnimatedSection key={m.name} delay={i * 0.1}>
              <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow h-full">
                <div className="w-14 h-14 rounded-full bg-gold-light flex items-center justify-center mx-auto mb-4">
                  <m.icon className="text-gold" size={28} />
                </div>
                <h3 className="font-serif font-semibold mb-2">{m.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{m.desc}</p>
                <Button variant="gold" size="sm" className="w-full">Donate Now</Button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* Allocation */}
    <section className="py-20 bg-muted">
      <div className="section-container max-w-2xl mx-auto">
        <AnimatedSection>
          <h2 className="text-3xl font-serif font-bold text-center mb-12">How Funds Are Allocated</h2>
          <div className="space-y-4">
            {allocation.map((a) => (
              <div key={a.label}>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>{a.label}</span>
                  <span>{a.pct}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-3 overflow-hidden">
                  <div className={`h-full rounded-full ${a.color} transition-all duration-1000`} style={{ width: `${a.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  </div>
);

export default Donate;
