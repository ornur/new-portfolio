import { lazy } from "react";

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

const SVG3D = lazy(() =>
  import("3dsvg").then(({ SVG3D }) => ({ default: SVG3D })),
);

type LogoDefinition = Omit<TechLogo, "node"> & { color: string; svg: string };

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

const staticSvg = (svg: string, color: string) => (
  <div
    className="h-full w-full [&_svg]:h-full [&_svg]:w-full"
    dangerouslySetInnerHTML={{
      __html: svg
        .replace('height="200px"', 'height="100%"')
        .replace('width="200px"', 'width="100%"'),
    }}
    style={{ color }}
  />
);

const logoNode = (
  logo: LogoDefinition,
  isMobile: boolean,
  onRendered?: () => void,
) => {
  if (isMobile) return staticSvg(logo.svg, logo.color);

  return (
    <SVG3D
      animate="spinFloat"
      className="cursor-grab"
      color={logo.color}
      cursorOrbit
      metalness={0}
      onLoadingChange={
        onRendered
          ? (loading, progress) => {
              if (!loading && progress === 100) {
                window.requestAnimationFrame(onRendered);
              }
            }
          : undefined
      }
      opacity={0}
      resetOnIdle
      roughness={1}
      shadow={false}
      svg={logo.svg}
    />
  );
};

export default function getTechLogos(
  isMobile: boolean,
  onFirstLogoRendered?: () => void,
): TechLogo[] {
  return logos.map((logo, index) => ({
    ...logo,
    node: logoNode(
      logo,
      isMobile,
      index === 0 ? onFirstLogoRendered : undefined,
    ),
  }));
}
