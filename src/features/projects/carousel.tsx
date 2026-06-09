import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Projects } from "./projects";

export function ProjectsCarousel() {
  return (
    <Carousel
      className="absolute top-1/2 left-1/2 w-full max-w-7xl -translate-x-1/2 -translate-y-1/2"
      opts={{ align: "start" }}
      plugins={[Autoplay({ delay: 4000 })]}
    >
      <CarouselContent className="-mt-1 h-80">
        <Projects />
      </CarouselContent>
      <CarouselPrevious
        className="dark:bg-neon dark:text-background scale-125"
        variant="default"
      />
      <CarouselNext
        className="dark:bg-neon dark:text-background scale-125"
        variant="default"
      />
    </Carousel>
  );
}
