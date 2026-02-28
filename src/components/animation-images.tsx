import { useRef } from "react";
import { motion, useAnimationControls } from "motion/react";
import useIsMobile from "@/hooks/useIsMobile";

// w: visual width of the card — varied intentionally for a dynamic feel
const ROW_1 = [
  { alt: "Afros", h: 450, mobile: { h: 350, w: "70vw" }, src: "/afros.png", w: "55vw" },
  { alt: "Anime", h: 450, mobile: { h: 350, w: "40vw" }, src: "/anime.png", w: "16vw" },
  { alt: "Cold", h: 450, mobile: { h: 350, w: "50vw" }, src: "/cold.png", w: "24vw" },
  { alt: "Concert", h: 450, mobile: { h: 350, w: "70vw" }, src: "/concert.png", w: "55vw" },
] as const;

const ROW_2 = [
  { alt: "Dias & Nurda", h: 450, mobile: { h: 350, w: "30vw" }, src: "/dias-nurda.png", w: "20vw" },
  { alt: "Dias", h: 450, mobile: { h: 350, w: "25vw" }, src: "/dias.png", w: "16vw" },
  { alt: "Nuris", h: 450, mobile: { h: 350, w: "30vw" }, src: "/nuris.png", w: "20vw" },
  { alt: "Nurs", h: 450, mobile: { h: 350, w: "60vw" }, src: "/nurs.png", w: "40vw" },
] as const;

type ImageItem = { alt: string; src: string; w: string; h: number; mobile?: { w: string; h: number } };

function ImageCard({ alt, mobile, src, w }: ImageItem) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, zIndex: 10 }}
      transition={{ damping: 22, stiffness: 300, type: "spring" }}
      className="relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl"
      style={{ height: mobile ? mobile.h : "50vh", width: mobile ? mobile.w : w }}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="h-full w-full object-cover"
        loading="lazy"
      />
      {/* Caption */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6"
      >
        <span className="text-xs font-semibold text-white">{alt}</span>
      </motion.div>
    </motion.div>
  );
}

function InfiniteRow({
  direction,
  duration,
  gap = 12,
  images,
}: {
  images: readonly ImageItem[];
  direction: "left" | "right";
  duration: number;
  gap?: number;
}) {
  const { isMobile } = useIsMobile();
  const controls = useAnimationControls();
  const started = useRef(false);

  // x animates to -50% of the doubled list = exactly one set's width → seamless loop
  const from = direction === "left" ? "0%" : "-50%";
  const to = direction === "left" ? "-50%" : "0%";

  const start = () => {
    controls.start({
      transition: { duration: isMobile ? duration * 0.2 : duration, ease: "linear", repeat: Infinity, repeatType: "loop" },
      x: [from, to],
    });
    started.current = true;
  };

  // kick off on mount via onViewportEnter so it doesn't run SSR
  const handleViewport = () => { if (!started.current) start(); };

  return (
    <div
      className="overflow-hidden h-full"
      onMouseEnter={() => controls.stop()}
      onMouseLeave={() => start()}
    >
      <motion.div
        animate={controls}
        onViewportEnter={handleViewport}
        className="flex"
        style={{ gap, willChange: "transform" }}
      >
        {/* Duplicate for seamless loop */}
        {[...images, ...images].map((img, i) => (
          <ImageCard key={`${img.src}-${i}`} {...img} mobile={isMobile ? img.mobile : undefined} />
        ))}
      </motion.div>
    </div>
  );
}

export function AnimationImages() {
  return (
    <div className="flex h-[95vh] flex-col gap-3 py-4 select-none">
      <InfiniteRow images={ROW_1} direction="left" duration={28} />
      <InfiniteRow images={ROW_2} direction="right" duration={22} />
    </div>
  );
}

