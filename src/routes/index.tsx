import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex h-screen items-center justify-center text-center text-3xl">
      HELLO
    </div>
  );
}
