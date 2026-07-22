import { Link } from "react-router-dom";
import { Lock, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { usePageContent } from "@/hooks/usePageContent";
import logoFallback from "@/assets/logo-icon.png";

const Footer = () => {
  const { t } = useLanguage();
  const settings = useSiteSettings();
  const content = usePageContent("footer", { desc: t.footer.desc });

  const socialLinks = [
    { url: settings.social_facebook, icon: Facebook, label: "Facebook" },
    { url: settings.social_twitter, icon: Twitter, label: "Twitter" },
    { url: settings.social_instagram, icon: Instagram, label: "Instagram" },
    { url: settings.social_linkedin, icon: Linkedin, label: "LinkedIn" },
    { url: settings.social_youtube, icon: Youtube, label: "YouTube" },
  ].filter((s) => s.url);

  return (
    <footer className="bg-navy-dark text-primary-foreground">
      <div className="section-container py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-accent/50 shadow-md bg-white flex items-center justify-center p-1">
                <img src={settings.logo_url || logoFallback} alt={settings.site_name} className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-serif font-bold">{settings.site_name}</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">{content.desc}</p>
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 mt-4">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-8 h-8 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                  >
                    <s.icon size={14} />
                  </a>
                ))}
              </div>
            )}
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
              {settings.footer_hq_text}<br />
              <span className="opacity-80">{t.footer.representations}</span><br />
              {settings.footer_regions_text}
            </p>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-50">
          <p>© {new Date().getFullYear()} {settings.site_tagline} ({settings.site_name}). {t.footer.allRights}</p>
          <div className="flex items-center gap-4">
            <Link to="/admin/login" className="flex items-center gap-1 hover:opacity-100 transition-opacity">
              <Lock size={10} /> Admin
            </Link>
            <a
              href="https://www.edunova-rdc.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-100 transition-opacity"
            >
              www.edunova-rdc.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
