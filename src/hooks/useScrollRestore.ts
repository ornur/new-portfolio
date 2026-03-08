import { useEffect } from "react";

import { scrollStore } from "@/utils/scrollStore";

export function useScrollRestore(routeKey: string) {
  useEffect(() => {
    const saved = scrollStore.get(routeKey);
    if (saved > 0) {
      window.scrollTo(0, saved);
    }

    const handleScroll = () => {
      scrollStore.set(routeKey, window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [routeKey]);
}
