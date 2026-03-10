import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About Us" },
  { path: "/founder", label: "Founder" },
  { path: "/in-memoriam", label: "In Memoriam" },
  { path: "/team", label: "Our Team" },
  { path: "/activities", label: "Activities" },
  { path: "/membership", label: "Membership" },
  { path: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="section-container flex items-center justify-between h-16 lg:h-20">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl lg:text-2xl font-serif font-bold text-primary">MUFO</span>
          <span className="hidden sm:inline text-xs text-muted-foreground">Muller's Foundation</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === link.path
                  ? "text-primary bg-green-light"
                  : "text-muted-foreground hover:text-primary hover:bg-green-light"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/donate">
            <Button variant="gold" size="sm" className="hidden sm:inline-flex">
              Make a Donation
            </Button>
          </Link>
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
          <div className="section-container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === link.path
                    ? "text-primary bg-green-light"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/donate" onClick={() => setOpen(false)}>
              <Button variant="gold" className="w-full mt-2">Make a Donation</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
