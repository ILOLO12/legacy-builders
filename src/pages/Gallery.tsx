import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Play, Image as ImageIcon, Video, X, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSEO } from "@/hooks/useSEO";
import { useLanguage } from "@/i18n/LanguageContext";
import { usePageContent } from "@/hooks/usePageContent";
import AnimatedSection from "@/components/AnimatedSection";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type GalleryItem = {
  id: string;
  title: string | null;
  description: string | null;
  media_url: string;
  media_type: string;
};

const Gallery = () => {
  const { t, lang } = useLanguage();
  useSEO("Gallery", "Photos and videos from MUFO's field operations and community programs.");
  const c = usePageContent("gallery", t.gallery);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["gallery-full"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as GalleryItem[];
    },
  });

  const filtered = items.filter((i) => filter === "all" || i.media_type === filter);
  const active = activeIndex !== null ? filtered[activeIndex] : null;

  const showPrev = () => setActiveIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  const showNext = () => setActiveIndex((i) => (i === null ? null : (i + 1) % filtered.length));

  const filters: { value: "all" | "image" | "video"; label: string; icon: typeof ImageIcon }[] = [
    { value: "all", label: lang === "fr" ? "Tout" : "All", icon: ImageIcon },
    { value: "image", label: lang === "fr" ? "Photos" : "Photos", icon: ImageIcon },
    { value: "video", label: lang === "fr" ? "Vidéos" : "Videos", icon: Video },
  ];

  return (
    <div>
      <section className="page-hero">
        <div className="section-container">
          <h1 className="page-hero-title">{c.title}</h1>
          <p className="page-hero-subtitle">{c.subtitle}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="section-container">
          <div className="flex items-center justify-center gap-2 mb-10">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                  filter === f.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <f.icon size={14} />
                {f.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <p className="text-center text-muted-foreground">{lang === "fr" ? "Chargement..." : "Loading..."}</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {lang === "fr" ? "Aucun média disponible pour le moment." : "No media available yet."}
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {filtered.map((item, i) => (
                <AnimatedSection key={item.id} delay={(i % 8) * 0.05}>
                  <button
                    onClick={() => setActiveIndex(i)}
                    className="relative w-full aspect-square rounded-xl overflow-hidden bg-primary/10 group cursor-pointer block"
                  >
                    {item.media_type === "video" ? (
                      <>
                        <video src={item.media_url} className="absolute inset-0 w-full h-full object-cover" muted playsInline />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            <Play className="text-accent-foreground ml-0.5" size={20} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <img
                        src={item.media_url}
                        alt={item.title ?? "MUFO gallery"}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    {item.title && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs font-medium text-left line-clamp-2">{item.title}</p>
                      </div>
                    )}
                  </button>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      <Dialog open={active !== null} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 border-none bg-transparent shadow-none [&>button]:hidden">
          {active && (
            <div className="relative bg-card rounded-xl overflow-hidden">
              <button
                onClick={() => setActiveIndex(null)}
                aria-label="Close"
                className="absolute right-3 top-3 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
              >
                <X size={18} />
              </button>
              {filtered.length > 1 && (
                <>
                  <button
                    onClick={showPrev}
                    aria-label="Previous"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    onClick={showNext}
                    aria-label="Next"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
              <div className="max-h-[80vh] flex items-center justify-center bg-black">
                {active.media_type === "video" ? (
                  <video src={active.media_url} controls autoPlay className="max-h-[80vh] w-full" />
                ) : (
                  <img src={active.media_url} alt={active.title ?? "MUFO gallery"} className="max-h-[80vh] w-full object-contain" />
                )}
              </div>
              {(active.title || active.description) && (
                <div className="p-4 text-left">
                  {active.title && <p className="font-serif font-semibold text-foreground">{active.title}</p>}
                  {active.description && <p className="text-sm text-muted-foreground mt-1">{active.description}</p>}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
