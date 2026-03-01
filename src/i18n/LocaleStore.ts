import { useSyncExternalStore } from "react";

export const locales = ["en", "kk", "ru"] as const;
export type Locale = (typeof locales)[number];

let locale: Locale = (() => {
  const saved = localStorage.getItem("locale") as Locale;
  return locales.includes(saved) ? saved : "ru";
})();

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const changeLocale = (next?: Locale) => {
  if (!next || !locales.includes(next)) {
    const currentIndex = locales.indexOf(locale);
    next = locales[(currentIndex + 1) % locales.length];
  }
  locale = next;
  localStorage.setItem("locale", next);
  listeners.forEach((l) => l());
};

export const useLocale = () => useSyncExternalStore(subscribe, () => locale);
