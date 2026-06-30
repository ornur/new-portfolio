import type { TechLogo } from "@/features/tech-stack/LogoSlide";

import { motionSvg } from "@/components/svg-logos/motion";
import { nextjsSvg } from "@/components/svg-logos/nextjs";
import { reactSvg } from "@/components/svg-logos/react";
import { shadcnSvg } from "@/components/svg-logos/shadcn";
import { tailwindSvg } from "@/components/svg-logos/tailwind";
import { tanstackSvg } from "@/components/svg-logos/tanstack";
import { typescriptSvg } from "@/components/svg-logos/typescript";
import { vercelSvg } from "@/components/svg-logos/vercel";
import { viteSvg } from "@/components/svg-logos/vite";

import type { LogoDefinition, LogoRenderMode } from "./logoTypes";

import { Logo3d } from "./Logo3d";
import { StaticLogo } from "./StaticLogo";

const logos: LogoDefinition[] = [
  {
    bgColor: "#20232a",
    color: "#61dbfb",
    href: "https://react.dev",
    svg: reactSvg,
    textColor: "#61dbfb",
    title: "React",
  },
  {
    bgColor: "#faf9f8",
    color: "#3178c6",
    href: "https://www.typescriptlang.org",
    svg: typescriptSvg,
    textColor: "#3178c6",
    title: "TypeScript",
  },
  {
    bgColor: "#0f172a",
    color: "#06b6d4",
    href: "https://tailwindcss.com",
    svg: tailwindSvg,
    textColor: "#06b6d4",
    title: "Tailwind CSS",
  },
  {
    bgColor: "#ffffff",
    color: "#000000",
    href: "https://nextjs.org",
    svg: nextjsSvg,
    textColor: "#000000",
    title: "Next.js",
  },
  {
    bgColor: "#232323",
    color: "#863BFF",
    href: "https://vitejs.dev",
    svg: viteSvg,
    textColor: "#ffffff",
    title: "Vite",
  },
  {
    bgColor: "#ffffff",
    color: "#000000",
    href: "https://tanstack.com",
    svg: tanstackSvg,
    textColor: "#000000",
    title: "Tanstack",
  },
  {
    bgColor: "#000000",
    color: "#ffffff",
    href: "https://ui.shadcn.com",
    svg: shadcnSvg,
    textColor: "#ffffff",
    title: "Shadcn/ui",
  },
  {
    bgColor: "#FFF312",
    color: "#000000",
    href: "https://motion.dev/",
    svg: motionSvg,
    textColor: "#000000",
    title: "Motion",
  },
  {
    bgColor: "#000000",
    color: "#ffffff",
    href: "https://vercel.com",
    svg: vercelSvg,
    textColor: "#ffffff",
    title: "Vercel",
  },
];

const logoNode = (
  logo: LogoDefinition,
  mode: LogoRenderMode,
  onRendered?: () => void,
) => {
  if (mode === "static") {
    return (
      <StaticLogo color={logo.color} onRendered={onRendered} svg={logo.svg} />
    );
  }

  return <Logo3d logo={logo} mode={mode} onRendered={onRendered} />;
};

export default function getTechLogos(
  isMobile: boolean,
  canRender3dSvg: boolean,
  onFirstLogoRendered?: () => void,
): TechLogo[] {
  const mode: LogoRenderMode = isMobile
    ? canRender3dSvg
      ? "mobile-3d"
      : "static"
    : "desktop";

  return logos.map((logo, index) => ({
    ...logo,
    node: logoNode(logo, mode, index === 0 ? onFirstLogoRendered : undefined),
  }));
}
