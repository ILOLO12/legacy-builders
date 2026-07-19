import { Link } from "react-router-dom";
import { Heart, Lock } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-dark text-primary-foreground">
      <div className="section-container py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-accent/50 shadow-md">
                <img src={logo} alt="MUFO" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-serif font-bold">MUFO</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">{t.footer.desc}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-accent text-sm uppercase tracking-wider">{t.footer.navigation}</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/" className="hover:opacity-100 transition-opacity">{t.footer.home}</Link></li>
              <li><Link to="/founder" className="hover:opacity-100 transition-opacity">{t.footer.about}</Link></li>
              <li><Link to="/activities" className="hover:opacity-100 transition-opacity">{t.footer.activities}</Link></li>
              <li><Link to="/contact" className="hover:opacity-100 transition-opacity">{t.footer.contact}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-accent text-sm uppercase tracking-wider">{t.footer.getInvolved}</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/membership" className="hover:opacity-100 transition-opacity">{t.footer.becomeMember}</Link></li>
              <li><Link to="/donate" className="hover:opacity-100 transition-opacity">{t.footer.makeDonation}</Link></li>
              <li><Link to="/team" className="hover:opacity-100 transition-opacity">{t.footer.ourTeam}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-accent text-sm uppercase tracking-wider">{t.footer.hq}</h4>
            <p className="text-sm opacity-70 leading-relaxed">
              Kinshasa, DR Congo<br />
              <span className="opacity-80">{t.footer.representations}</span><br />
              USA · France · Canada
            </p>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-50">
          <p>© {new Date().getFullYear()} Muller's Foundation (MUFO). {t.footer.allRights}</p>
          <div className="flex items-center gap-4">
            <Link to="/admin/login" className="flex items-center gap-1 hover:opacity-100 transition-opacity">
              <Lock size={10} /> Admin
            </Link>
            <p className="flex items-center gap-1">{t.footer.builtWith} <Heart size={12} className="text-accent" /> {t.footer.forHumanity}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
