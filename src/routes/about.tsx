import { AnimationImages } from "@/components/animation-images";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return <AnimationImages/>
}
