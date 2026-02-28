import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="h-screen text-center items-center justify-center flex text-3xl">HELLO</div>
  );
}
