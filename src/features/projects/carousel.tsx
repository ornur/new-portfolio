import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/useIsMobile";

import { Projects } from "./projects";

export function ProjectsCarousel() {
  const { isMobile } = useIsMobile();
  return (
    <Carousel
      className="absolute top-1/2 left-1/2 w-full max-w-xs -translate-x-1/2 -translate-y-1/2 lg:max-w-7xl"
      opts={{ align: "start" }}
      orientation={isMobile ? "vertical" : "horizontal"}
      plugins={[Autoplay({ delay: 4000 })]}
    >
      <CarouselContent className="-mt-1 h-90 lg:h-80">
        <Projects isMobile={isMobile} />
      </CarouselContent>
      <CarouselPrevious
        className="dark:bg-neon dark:text-background scale-150 lg:scale-125"
        variant="default"
      />
      <CarouselNext
        className="dark:bg-neon dark:text-background scale-150 lg:scale-125"
        variant="default"
      />
    </Carousel>
  );
}
