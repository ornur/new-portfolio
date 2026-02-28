import { AnimationImages } from "@/components/animation-images";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <AnimationImages />
  );
}
