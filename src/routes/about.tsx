import { createFileRoute } from "@tanstack/react-router";
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
  return <></>;
}
