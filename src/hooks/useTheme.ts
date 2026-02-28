"use client";
import { useLayoutEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = (localStorage.getItem("theme") as "light" | "dark") ?? "dark";
    document.documentElement.classList.toggle("dark", saved === "dark");
    localStorage.setItem("theme", saved);
    return saved;
  });

  useLayoutEffect(() => {
    // Listen for theme changes using MutationObserver
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const isDark = document.documentElement.classList.contains("dark");
          setTheme(isDark ? "dark" : "light");
        }
      });
    });

    observer.observe(document.documentElement, {
      attributeFilter: ["class"],
      attributes: true,
    });

    // Also listen for custom theme change events
    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };

    window.addEventListener("themechange", handleThemeChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("themechange", handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      localStorage.setItem("theme", newTheme);

      // Dispatch custom event asynchronously to avoid render conflicts
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("themechange"));
      }, 0);

      return newTheme;
    });
  };

  return { theme, toggleTheme };
}
