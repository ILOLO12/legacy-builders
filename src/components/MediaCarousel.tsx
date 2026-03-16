import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { type: "image" as const, src: "", alt: "Field activity 1", caption: "Educational support in Kinshasa" },
  { type: "image" as const, src: "", alt: "Field activity 2", caption: "Community health screening" },
  { type: "image" as const, src: "", alt: "Field activity 3", caption: "Youth mentorship program" },
  { type: "video" as const, src: "", alt: "Documentary 1", caption: "MUFO Impact Documentary" },
  { type: "image" as const, src: "", alt: "Field activity 4", caption: "School supply distribution" },
  { type: "image" as const, src: "", alt: "Field activity 5", caption: "Teacher training workshop" },
  { type: "video" as const, src: "", alt: "Documentary 2", caption: "Voices from the Field" },
  { type: "image" as const, src: "", alt: "Field activity 6", caption: "Community gathering" },
  { type: "video" as const, src: "", alt: "Documentary 3", caption: "Building Tomorrow" },
];

const MediaCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1, direction: "ltr" },
    [Autoplay({ delay: 3500, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5">
          {slides.map((slide, i) => (
            <div
              key={i}
              className="flex-[0_0_70%] sm:flex-[0_0_35%] lg:flex-[0_0_22%] min-w-0"
            >
              <div className="relative bg-primary/10 rounded-xl overflow-hidden aspect-[16/10] flex items-center justify-center group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/70 to-secondary/50" />
                {slide.type === "video" && (
                  <div className="relative z-10 w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Play className="text-accent-foreground ml-1" size={24} />
                  </div>
                )}
                {slide.type === "image" && (
                  <div className="relative z-10 text-primary-foreground/50 text-xs uppercase tracking-wider">
                    Photo
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/90 to-transparent p-4 z-10">
                  <p className="text-primary-foreground text-xs font-medium">{slide.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Controls */}
      <button
        onClick={scrollPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 shadow-lg flex items-center justify-center hover:bg-card transition-colors z-20"
      >
        <ChevronLeft size={20} className="text-foreground" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 shadow-lg flex items-center justify-center hover:bg-card transition-colors z-20"
      >
        <ChevronRight size={20} className="text-foreground" />
      </button>
    </div>
  );
};

export default MediaCarousel;
