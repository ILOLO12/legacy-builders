import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const MediaCarousel = () => {
  const { data: slides = [] } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: slides.length > 1, align: "start", slidesToScroll: 1, direction: "ltr" },
    [Autoplay({ delay: 3500, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (slides.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="flex-[0_0_70%] sm:flex-[0_0_35%] lg:flex-[0_0_22%] min-w-0"
            >
              <div className="relative bg-primary/10 rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center group cursor-pointer">
                {slide.media_type === "video" ? (
                  <>
                    <video src={slide.media_url} className="absolute inset-0 w-full h-full object-cover" muted loop playsInline />
                    <div className="relative z-10 w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="text-accent-foreground ml-1" size={24} />
                    </div>
                  </>
                ) : (
                  <img
                    src={slide.media_url}
                    alt={slide.title ?? "MUFO gallery"}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                {slide.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <p className="text-primary-foreground text-xs font-medium">{slide.title}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Controls */}
      <button
        onClick={scrollPrev}
        aria-label="Previous"
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 shadow-lg flex items-center justify-center hover:bg-card transition-colors z-20"
      >
        <ChevronLeft size={20} className="text-foreground" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next"
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 shadow-lg flex items-center justify-center hover:bg-card transition-colors z-20"
      >
        <ChevronRight size={20} className="text-foreground" />
      </button>
    </div>
  );
};

export default MediaCarousel;
