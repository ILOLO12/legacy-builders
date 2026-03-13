import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Globe, Home, Info, Activity, Newspaper, Users, Phone, Heart } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import logo from "@/assets/logo.jpeg";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t } = useLanguage();

  const mainLinks = [
    { path: "/", label: t.nav.home, icon: Home },
    {
      label: t.nav.about,
      icon: Info,
      children: [
        { path: "/founder", label: t.nav.founder },
        { path: "/history", label: t.nav.history },
        { path: "/in-memoriam", label: t.nav.inMemoriam },
      ],
    },
    { path: "/activities", label: t.nav.activities, icon: Activity },
    { path: "/news", label: t.nav.news, icon: Newspaper },
    { path: "/membership", label: t.nav.membership, icon: Users },
    { path: "/contact", label: t.nav.contact, icon: Phone },
  ];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setOpen(false);
    setAboutOpen(false);
    setMobileAboutOpen(false);
  }, [location.pathname]);

  const isAboutActive = ["/founder", "/history", "/in-memoriam"].includes(location.pathname);

  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="section-container flex items-center justify-between h-16 lg:h-[72px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-accent/50 shadow-md">
            <img src={logo} alt="MUFO Logo" className="w-full h-full object-cover" />
          </div>
          <div className="leading-tight">
            <span className="text-lg font-serif font-bold tracking-wide text-accent">MUFO</span>
            <span className="hidden sm:block text-[10px] text-accent/70 tracking-wider uppercase">Muller's Foundation</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {mainLinks.map((link) =>
            link.children ? (
              <div key={link.label} className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setAboutOpen(!aboutOpen)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold tracking-wide rounded-md transition-colors ${
                    isAboutActive
                      ? "bg-primary-foreground/15 text-primary-foreground"
                      : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  }`}
                >
                  <link.icon size={15} />
                  {link.label}
                  <ChevronDown size={14} className={`transition-transform ${aboutOpen ? "rotate-180" : ""}`} />
                </button>
                {aboutOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-card text-card-foreground rounded-lg shadow-xl border border-border py-2 animate-fade-in-up">
                    {link.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          location.pathname === child.path
                            ? "bg-accent/10 text-accent font-medium"
                            : "hover:bg-muted"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.path}
                to={link.path!}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold tracking-wide rounded-md transition-colors ${
                  location.pathname === link.path
                    ? "bg-primary-foreground/15 text-primary-foreground"
                    : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                }`}
              >
                <link.icon size={15} />
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === "en" ? "fr" : "en")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground transition-colors"
            aria-label="Toggle language"
          >
            <Globe size={14} />
            {lang === "en" ? "FR" : "EN"}
          </button>
          <Link to="/donate">
            <Button variant="gold" size="sm" className="hidden sm:inline-flex">
              {t.nav.donate}
            </Button>
          </Link>
          <button
            className="lg:hidden p-2 text-primary-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="lg:hidden border-t border-primary-foreground/10 bg-primary animate-fade-in-up">
          <div className="section-container py-4 flex flex-col gap-1">
            {mainLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <button
                    onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold tracking-wide text-primary-foreground/80 rounded-md"
                  >
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform ${mobileAboutOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileAboutOpen && (
                    <div className="ml-4 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className="block px-3 py-2 text-sm text-primary-foreground/70 hover:text-primary-foreground"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path!}
                  className="px-3 py-2 text-sm font-semibold tracking-wide text-primary-foreground/80 hover:text-primary-foreground rounded-md"
                >
                  {link.label}
                </Link>
              )
            )}
            <Link to="/donate" className="mt-2">
              <Button variant="gold" className="w-full">{t.nav.donate}</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
