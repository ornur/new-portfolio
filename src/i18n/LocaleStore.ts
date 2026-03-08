import { useSyncExternalStore } from "react";

export const locales = ["en", "kk", "ru"] as const;
export type Locale = (typeof locales)[number];

let locale: Locale = (() => {
  const saved = localStorage.getItem("locale") as Locale;
  const initial = locales.includes(saved) ? saved : "en";
  document.documentElement.lang = initial;
  return initial;
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
  document.documentElement.lang = next;
  listeners.forEach((l) => l());
};

export const useLocale = () => useSyncExternalStore(subscribe, () => locale);
