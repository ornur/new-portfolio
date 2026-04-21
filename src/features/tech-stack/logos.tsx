// import { SVG3D } from "3dsvg";

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
  import("3dsvg").then((mod) => ({
    default: mod.SVG3D,
  })),
);

const normalizeSvgForContainer = (svg: string) =>
  svg
    .replace('height="200px"', 'height="100%"')
    .replace('width="200px"', 'width="100%"');

const renderStaticSvg = (svg: string, color: string) => (
  <div
    className="h-full w-full [&_svg]:h-full [&_svg]:w-full"
    dangerouslySetInnerHTML={{
      __html: normalizeSvgForContainer(svg),
    }}
    style={{ color }}
  />
);

const renderLogoNode = (
  isMobile: boolean,
  svg: string,
  color: string,
  debugLabel?: string,
) => {
  if (isMobile) {
    return renderStaticSvg(svg, color);
  }

  return (
    <SVG3D
      animate="spinFloat"
      className="cursor-grab"
      color={color}
      cursorOrbit
      metalness={0}
      onLoadingChange={(loading, progress) => {
        if (debugLabel) {
          if (loading) console.log(`${debugLabel}: ${progress}%`);
          else console.log(`${debugLabel}: done`);
        }
      }}
      opacity={0}
      resetOnIdle
      roughness={1}
      shadow={false}
      svg={svg}
    />
  );
};

const getTechLogos = (isMobile: boolean): TechLogo[] => [
  {
    bgColor: "#20232a",
    href: "https://react.dev",
    node: renderLogoNode(isMobile, reactSvg, "#61dbfb", "react"),
    textColor: "#61dbfb",
    title: "React",
  },
  {
    bgColor: "#faf9f8",
    href: "https://www.typescriptlang.org",
    node: renderLogoNode(isMobile, typescriptSvg, "#3178c6"),
    textColor: "#3178c6",
    title: "TypeScript",
  },
  {
    bgColor: "#0f172a",
    href: "https://tailwindcss.com",
    node: renderLogoNode(isMobile, tailwindSvg, "#06b6d4"),
    textColor: "#06b6d4",
    title: "Tailwind CSS",
  },
  {
    bgColor: "#ffffff",
    href: "https://nextjs.org",
    node: renderLogoNode(isMobile, nextjsSvg, "#000000"),
    textColor: "#000000",
    title: "Next.js",
  },
  {
    bgColor: "#232323",
    href: "https://vitejs.dev",
    node: renderLogoNode(isMobile, viteSvg, "#863BFF"),
    textColor: "#ffffff",
    title: "Vite",
  },
  {
    bgColor: "#ffffff",
    href: "https://tanstack.com",
    node: renderLogoNode(isMobile, tanstackSvg, "#000000"),
    textColor: "#000000",
    title: "Tanstack",
  },
  {
    bgColor: "#000000",
    href: "https://ui.shadcn.com",
    node: renderLogoNode(isMobile, shadcnSvg, "#ffffff"),
    textColor: "#ffffff",
    title: "Shadcn/ui",
  },
  {
    bgColor: "#FFF312",
    href: "https://motion.dev/",
    node: renderLogoNode(isMobile, motionSvg, "#000000"),
    textColor: "#000000",
    title: "Motion",
  },
  {
    bgColor: "#000000",
    href: "https://vercel.com",
    node: renderLogoNode(isMobile, vercelSvg, "#ffffff"),
    textColor: "#ffffff",
    title: "Vercel",
  },
];

export default getTechLogos;
