import AnimatedSection from "@/components/AnimatedSection";
import { User } from "lucide-react";

const teamMembers = [
  { name: "Kevin J. Kapuku", role: "Founder & CEO", desc: "Visionary leader driving MUFO's mission and global strategy.", isCeo: true },
  { name: "Marie N. Kapuku", role: "Director of Operations", desc: "Oversees daily operations and program delivery across all regions." },
  { name: "Patrick M. Lunda", role: "Head of Education Programs", desc: "Designs and implements educational initiatives for children and youth." },
  { name: "Sarah K. Mbaya", role: "Health Programs Coordinator", desc: "Manages community health campaigns and partnerships." },
  { name: "David T. Mukendi", role: "Finance & Transparency Officer", desc: "Ensures accountability and transparent financial reporting." },
  { name: "Grace L. Ilunga", role: "Communications Director", desc: "Leads outreach, storytelling, and donor engagement strategies." },
];

const Team = () => (
  <div>
    <section className="page-hero">
      <div className="section-container">
        <h1 className="page-hero-title">Our Team</h1>
        <p className="page-hero-subtitle">Dedicated professionals united by a shared commitment to impact.</p>
      </div>
    </section>

    <section className="py-20">
      <div className="section-container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((m, i) => (
            <AnimatedSection key={m.name} delay={i * 0.1}>
              <div className={`bg-card border rounded-lg p-6 text-center hover:shadow-lg transition-shadow ${m.isCeo ? "border-gold border-2 ring-2 ring-gold/20" : "border-border"}`}>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${m.isCeo ? "bg-gold/20" : "bg-green-light"}`}>
                  <User className={m.isCeo ? "text-gold" : "text-primary"} size={32} />
                </div>
                <h3 className="text-lg font-serif font-semibold">{m.name}</h3>
                <p className={`text-sm font-medium mb-3 ${m.isCeo ? "text-gold" : "text-primary"}`}>{m.role}</p>
                <p className="text-sm text-muted-foreground">{m.desc}</p>
                {m.isCeo && <span className="inline-block mt-3 text-xs font-semibold bg-gold/10 text-gold px-3 py-1 rounded-full">Leadership</span>}
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.4}>
          <div className="mt-16 max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-serif font-bold mb-4">Governance & Transparency</h3>
            <p className="text-muted-foreground leading-relaxed">
              MUFO is governed by a commitment to full transparency and accountability. Every team member upholds our core values of integrity, compassion, and excellence in serving communities.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  </div>
);

export default Team;
