import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="section-container py-12 lg:py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-serif font-bold mb-4">Muller's Foundation</h3>
          <p className="text-sm opacity-80 leading-relaxed">
            Transforming potential into sustainable opportunity since 2021.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-gold">Quick Links</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/about" className="hover:opacity-100 transition-opacity">About Us</Link></li>
            <li><Link to="/activities" className="hover:opacity-100 transition-opacity">Activities</Link></li>
            <li><Link to="/donate" className="hover:opacity-100 transition-opacity">Donate</Link></li>
            <li><Link to="/contact" className="hover:opacity-100 transition-opacity">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-gold">Get Involved</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/membership" className="hover:opacity-100 transition-opacity">Become a Member</Link></li>
            <li><Link to="/donate" className="hover:opacity-100 transition-opacity">Make a Donation</Link></li>
            <li><Link to="/team" className="hover:opacity-100 transition-opacity">Our Team</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-gold">Headquarters</h4>
          <p className="text-sm opacity-80 leading-relaxed">
            Kinshasa, DR Congo<br />
            Representations: USA, France, Canada
          </p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm opacity-70">
        <p>© {new Date().getFullYear()} Muller's Foundation (MUFO). All rights reserved.</p>
        <p className="flex items-center gap-1">Built with <Heart size={14} className="text-gold" /> for humanity</p>
      </div>
    </div>
  </footer>
);

export default Footer;
