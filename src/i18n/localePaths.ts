import { type Locale, locales } from "./LocaleStore";

export const defaultLocale: Locale = "en";
export const localizedLocales = locales.filter(
  (locale) => locale !== defaultLocale,
);

export function getLocaleFromPath(pathname: string): Locale | undefined {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return locales.includes(firstSegment as Locale)
    ? (firstSegment as Locale)
    : undefined;
}

export function localizePath(pathname: string, locale: Locale) {
  const basePath = stripLocaleFromPath(pathname);
  if (locale === defaultLocale) return basePath;
  return basePath === "/" ? `/${locale}` : `/${locale}${basePath}`;
}

export function stripLocaleFromPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (locales.includes(parts[0] as Locale)) {
    parts.shift();
  }
  return `/${parts.join("/")}`.replace(/\/$/, "") || "/";
}
