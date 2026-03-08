import { createFileRoute } from "@tanstack/react-router";
import { useScroll } from "motion/react";
import { useRef } from "react";
import {
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { useTranslations } from "use-intl";

import { LogoSlide, type TechLogo } from "@/components/custom/LogoSlide";
import { MotionSVG } from "@/components/logos/motion";
import { ShadcnSVG } from "@/components/logos/shadcn";
import { TanstackSVG } from "@/components/logos/tanstack";
import { VercelSVG } from "@/components/logos/vercel";
import { ViteSVG } from "@/components/logos/vite";
import { useIsMobile } from "@/hooks/useIsMobile";

export const Route = createFileRoute("/tech-stack")({
  component: RouteComponent,
});

const techLogos: TechLogo[] = [
  {
    bgColor: "#20232a",
    href: "https://react.dev",
    node: <SiReact className="bg-[#20232a] text-[#61dbfb]" />,
    textColor: "#61dbfb",
    title: "React",
  },
  {
    bgColor: "#faf9f8",
    href: "https://www.typescriptlang.org",
    node: <SiTypescript className="bg-[#faf9f8] text-[#3178c6]" />,
    textColor: "#3178c6",
    title: "TypeScript",
  },
  {
    bgColor: "#0f172a",
    href: "https://tailwindcss.com",
    node: <SiTailwindcss className="bg-slate-900 text-cyan-500" />,
    textColor: "#06b6d4",
    title: "Tailwind CSS",
  },
  {
    bgColor: "#ffffff",
    href: "https://nextjs.org",
    node: <SiNextdotjs className="bg-[#ffffff] text-[#000000]" />,
    textColor: "#000000",
    title: "Next.js",
  },
  {
    bgColor: "#232323",
    href: "https://vitejs.dev",
    node: <ViteSVG className="bg-[#232323]" />,
    textColor: "#ffffff",
    title: "Vite",
  },
  {
    bgColor: "#ffffff",
    href: "https://tanstack.com",
    node: <TanstackSVG className="bg-white" />,
    textColor: "#000000",
    title: "Tanstack",
  },
  {
    bgColor: "#000000",
    href: "https://ui.shadcn.com",
    node: <ShadcnSVG className="bg-black text-white" />,
    textColor: "#ffffff",
    title: "Shadcn/ui",
  },
  {
    bgColor: "#FFF312",
    href: "https://motion.dev/",
    node: <MotionSVG className="bg-[#FFF312]" />,
    textColor: "#000000",
    title: "Motion",
  },
  {
    bgColor: "#000000",
    href: "https://vercel.com",
    node: <VercelSVG className="bg-[#000000]" />,
    textColor: "#ffffff",
    title: "Vercel",
  },
];

const LOGO_COUNT = techLogos.length;

function RouteComponent() {
  const outerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("TechStack");
  const { isMobile } = useIsMobile();

  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
    target: outerRef,
  });

  return (
    <div
      ref={outerRef}
      style={{ height: `calc(${LOGO_COUNT * (isMobile ? 1000 : 2000)}px)` }}
    >
      <h1 className="absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 transform text-2xl font-bold text-nowrap opacity-70 md:text-4xl">
        {t("title")}
      </h1>
      <div className="sticky top-0 h-screen overflow-hidden">
        {techLogos.map((logo, i) => (
          <LogoSlide
            index={i}
            key={logo.title}
            logo={logo}
            logoCount={LOGO_COUNT}
            logoSize={isMobile ? "18vh" : "35vh"}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
}
