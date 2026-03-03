import { createFileRoute } from "@tanstack/react-router";

import Galaxy from "@/components/react-bits/Galaxy";
import { seo } from "@/utils/seo";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: seo({
      description:
        "Learn more about Nurdaulet Orynbasarov — a frontend developer with experience in React, TypeScript, and modern web technologies.",
      title: "About - Nurdaulet Orynbasarov",
      url: "https://nurda.vercel.app/about",
    }),
  }),
});

function About() {
  return (
    <div className="relative h-screen w-screen">
      <Galaxy
        density={1.1}
        glowIntensity={0.12}
        hueShift={140}
        mouseInteraction={false}
        mouseRepulsion={false}
        repulsionStrength={0}
        rotationSpeed={0}
        saturation={0}
        speed={0.2}
        starSpeed={0.3}
        transparent
        twinkleIntensity={0}
      />
    </div>
  );
}
