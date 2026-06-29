import { useSyncExternalStore } from "react";

export const locales = ["en", "kk", "ru"] as const;
export type Locale = (typeof locales)[number];

const getLocaleFromPath = (pathname = window.location.pathname) => {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return locales.includes(firstSegment as Locale)
    ? (firstSegment as Locale)
    : undefined;
};

let locale: Locale = (() => {
  const pathLocale = getLocaleFromPath();
  const saved = localStorage.getItem("locale") as Locale;
  const initial = pathLocale ?? (locales.includes(saved) ? saved : "en");
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

export const syncLocaleFromPath = (pathname = window.location.pathname) => {
  const pathLocale = getLocaleFromPath(pathname);
  const next = pathLocale ?? "en";
  if (locale === next) return;
  locale = next;
  localStorage.setItem("locale", next);
  document.documentElement.lang = next;
  listeners.forEach((l) => l());
};

export const useLocale = () => useSyncExternalStore(subscribe, () => locale);
