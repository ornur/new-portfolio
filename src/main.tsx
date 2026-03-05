import { createRouter, RouterProvider } from "@tanstack/react-router";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "./styles/index.css";
import ScreenTransition from "./components/loader/ScreenTransition";
import { useTheme } from "./hooks/useTheme";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({
  context: { theme: undefined! },
  routeTree,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const { theme } = useTheme();
  return (
    <>
      <ScreenTransition />
      <RouterProvider context={{ theme }} router={router} />
      <SpeedInsights />
    </>
  );
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
