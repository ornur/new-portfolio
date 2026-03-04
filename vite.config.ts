import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          icons: ["lucide-react", "react-icons"],
          motion: ["motion/react"],
          vendor: ["react", "react-dom", "@tanstack/react-router"],
        },
      },
    },
  },
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      generatedRouteTree: "src/routeTree.gen.ts",
      quoteStyle: "double",
      routeFileIgnorePrefix: "-",
      routesDirectory: "src/routes",
      target: "react",
    }),
    tailwindcss(),
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
  publicDir: "src/public",
  resolve: { alias: { "@": "/src" } },
});
