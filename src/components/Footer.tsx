import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="bg-navy-dark text-primary-foreground">
    <div className="section-container py-14 lg:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <span className="text-sm font-bold text-accent-foreground">M</span>
            </div>
            <span className="text-xl font-serif font-bold">MUFO</span>
          </div>
          <p className="text-sm opacity-70 leading-relaxed">
            Transforming potential into sustainable opportunity since 2021. An international humanitarian organization headquartered in Kinshasa, DR Congo.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-accent text-sm uppercase tracking-wider">Navigation</h4>
          <ul className="space-y-2 text-sm opacity-70">
            <li><Link to="/" className="hover:opacity-100 transition-opacity">Home</Link></li>
            <li><Link to="/founder" className="hover:opacity-100 transition-opacity">About</Link></li>
            <li><Link to="/activities" className="hover:opacity-100 transition-opacity">Activities</Link></li>
            <li><Link to="/contact" className="hover:opacity-100 transition-opacity">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-accent text-sm uppercase tracking-wider">Get Involved</h4>
          <ul className="space-y-2 text-sm opacity-70">
            <li><Link to="/membership" className="hover:opacity-100 transition-opacity">Become a Member</Link></li>
            <li><Link to="/donate" className="hover:opacity-100 transition-opacity">Make a Donation</Link></li>
            <li><Link to="/team" className="hover:opacity-100 transition-opacity">Our Team</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-accent text-sm uppercase tracking-wider">Headquarters</h4>
          <p className="text-sm opacity-70 leading-relaxed">
            Kinshasa, DR Congo<br />
            <span className="opacity-80">Representations:</span><br />
            USA · France · Canada
          </p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-50">
        <p>© {new Date().getFullYear()} Muller's Foundation (MUFO). All rights reserved.</p>
        <p className="flex items-center gap-1">Built with <Heart size={12} className="text-accent" /> for humanity</p>
      </div>
    </div>
  </footer>
);

export default Footer;
