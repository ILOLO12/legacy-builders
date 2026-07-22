import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { FacebookIcon, XIcon, LinkedInIcon, WhatsAppIcon } from "@/components/icons/SocialIcons";

interface ShareButtonsProps {
  url: string;
  title: string;
}

const ShareButtons = ({ url, title }: ShareButtonsProps) => {
  const { lang } = useLanguage();
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "Facebook",
      Icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "X",
      Icon: XIcon,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: "LinkedIn",
      Icon: LinkedInIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "WhatsApp",
      Icon: WhatsAppIcon,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — silently ignore
    }
  };

  return (
    <div className="flex items-center flex-wrap gap-2">
      <span className="text-sm font-medium text-muted-foreground mr-1">
        {lang === "fr" ? "Partager :" : "Share:"}
      </span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${l.label}`}
          className="w-9 h-9 rounded-full shadow-sm hover:scale-110 hover:shadow-md transition-transform"
        >
          <l.Icon className="w-full h-full" />
        </a>
      ))}
      <button
        onClick={copyLink}
        aria-label={lang === "fr" ? "Copier le lien" : "Copy link"}
        className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
      >
        {copied ? <Check size={16} /> : <Link2 size={16} />}
      </button>
    </div>
  );
};

export default ShareButtons;
