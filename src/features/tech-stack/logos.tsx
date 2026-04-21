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

const techLogos: TechLogo[] = [
  {
    bgColor: "#20232a",
    href: "https://react.dev",
    node: (
      <SVG3D
        animate="spinFloat"
        className="cursor-grab"
        color="#61dbfb"
        cursorOrbit
        metalness={0}
        onLoadingChange={(loading, progress) => {
          if (loading) console.log(`Processing: ${progress}%`);
          else console.log("Done");
        }}
        opacity={0}
        resetOnIdle
        roughness={1}
        shadow={false}
        svg={reactSvg}
      />
    ),
    textColor: "#61dbfb",
    title: "React",
  },
  {
    bgColor: "#faf9f8",
    href: "https://www.typescriptlang.org",
    node: (
      <SVG3D
        animate="spinFloat"
        className="cursor-grab"
        color="#3178c6"
        cursorOrbit
        metalness={0}
        opacity={0}
        resetOnIdle
        roughness={1}
        shadow={false}
        svg={typescriptSvg}
      />
    ),
    textColor: "#3178c6",
    title: "TypeScript",
  },
  {
    bgColor: "#0f172a",
    href: "https://tailwindcss.com",
    node: (
      <SVG3D
        animate="spinFloat"
        className="cursor-grab"
        color="#06b6d4"
        cursorOrbit
        metalness={0}
        opacity={0}
        resetOnIdle
        roughness={1}
        shadow={false}
        svg={tailwindSvg}
      />
    ),
    textColor: "#06b6d4",
    title: "Tailwind CSS",
  },
  {
    bgColor: "#ffffff",
    href: "https://nextjs.org",
    node: (
      <SVG3D
        animate="spinFloat"
        className="cursor-grab"
        color="#000000"
        cursorOrbit
        metalness={0}
        opacity={0}
        resetOnIdle
        roughness={1}
        shadow={false}
        svg={nextjsSvg}
      />
    ),
    textColor: "#000000",
    title: "Next.js",
  },
  {
    bgColor: "#232323",
    href: "https://vitejs.dev",
    node: (
      <SVG3D
        animate="spinFloat"
        className="cursor-grab"
        color="#863BFF"
        cursorOrbit
        metalness={0}
        opacity={0}
        resetOnIdle
        roughness={1}
        shadow={false}
        svg={viteSvg}
      />
    ),
    textColor: "#ffffff",
    title: "Vite",
  },
  {
    bgColor: "#ffffff",
    href: "https://tanstack.com",
    node: (
      <SVG3D
        animate="spinFloat"
        className="cursor-grab"
        color="#000000"
        cursorOrbit
        metalness={0}
        opacity={0}
        resetOnIdle
        roughness={1}
        shadow={false}
        svg={tanstackSvg}
      />
    ),
    textColor: "#000000",
    title: "Tanstack",
  },
  {
    bgColor: "#000000",
    href: "https://ui.shadcn.com",
    // node: <ShadcnSVG className="bg-black text-white" />,
    node: (
      <SVG3D
        animate="spinFloat"
        className="cursor-grab"
        color="#ffffff"
        cursorOrbit
        metalness={0}
        opacity={0}
        resetOnIdle
        roughness={1}
        shadow={false}
        svg={shadcnSvg}
      />
    ),
    textColor: "#ffffff",
    title: "Shadcn/ui",
  },
  {
    bgColor: "#FFF312",
    href: "https://motion.dev/",
    // node: <MotionSVG className="bg-[#FFF312]" />,
    node: (
      <SVG3D
        animate="spinFloat"
        className="cursor-grab"
        color="#000000"
        cursorOrbit
        metalness={0}
        opacity={0}
        resetOnIdle
        roughness={1}
        shadow={false}
        svg={motionSvg}
      />
    ),
    textColor: "#000000",
    title: "Motion",
  },
  {
    bgColor: "#000000",
    href: "https://vercel.com",
    // node: <VercelSVG className="bg-[#000000]" />,
    node: (
      <SVG3D
        animate="spinFloat"
        className="cursor-grab"
        color="#ffffff"
        cursorOrbit
        metalness={0}
        opacity={0}
        resetOnIdle
        roughness={1}
        shadow={false}
        svg={vercelSvg}
      />
    ),
    textColor: "#ffffff",
    title: "Vercel",
  },
];

export default techLogos;
