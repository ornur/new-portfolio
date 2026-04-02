import { SpinningText } from "@/components/motion-primitives/SpinningText";
import { useIsMobile } from "@/hooks/useIsMobile";

export function ScrollDownText() {
  const { isMobile } = useIsMobile();
  return (
    <div className="text-background dark:text-neon pointer-events-none fixed top-0 right-0 z-1 -translate-x-9 translate-y-10 text-center whitespace-nowrap mix-blend-difference md:-translate-x-15 md:translate-y-16">
      <SpinningText
        fontSize={isMobile ? 0.5 : 0.7}
        radius={isMobile ? 5 : 6}
        variants={{
          container: {
            visible: {
              animationDelay: 5000,
              opacity: 1,
              rotate: 360,
              transition: {
                bounce: 0,
                delay: 2, // Wait 4 seconds for the rotation
                delayChildren: 2, // Start animating children after 4 seconds
                duration: 6,
                ease: "linear",
                repeat: Infinity,
                staggerChildren: 0.03,
                type: "spring",
              },
              transitionDelay: 5000,
            },
          },
          item: {
            hidden: {
              filter: "blur(4px)",
              opacity: 0,
            },
            visible: {
              filter: "blur(0px)",
              opacity: 1,
            },
          },
        }}
      >
        {`SCROLL DOWN • SCROLL DOWN • `}
      </SpinningText>
    </div>
  );
}
