import type { TechLogo } from "@/features/tech-stack/LogoSlide";

export type LogoDefinition = Omit<TechLogo, "node"> & {
  color: string;
  svg: string;
};

export type LogoRenderMode = "desktop" | "mobile-3d" | "static";
