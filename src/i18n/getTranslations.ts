import type { Messages, NamespaceKeys, NestedKeyOf } from "use-intl";

import { type Locale, locales } from "./LocaleStore";
import { messages } from "./messages";

export type SimpleTranslator<N extends keyof Messages> = (
  key: NestedKeyOf<Messages[N]>,
  values?: Record<string, Date | number | string>,
) => string;

/**
 * Non-hook translation helper for use outside React (e.g. in TanStack Router
 * `head` callbacks). Reads the locale from localStorage at call time.
 */
export function getTranslations<
  N extends keyof Messages & NamespaceKeys<Messages, NestedKeyOf<Messages>>,
>(namespace?: N): SimpleTranslator<N> {
  const locale = getLocale();
  const msgs: Messages = messages[locale];

  return (key, values) => {
    const fullKey = namespace ? `${namespace}.${String(key)}` : String(key);
    let template = getByPath(msgs as Record<string, unknown>, fullKey);
    if (values) {
      Object.entries(values).forEach(([k, v]) => {
        template = template.replace(new RegExp(`{${k}}`, "g"), String(v));
      });
    }
    return template;
  };
}

function getByPath(obj: Record<string, unknown>, path: string): string {
  const result = path
    .split(".")
    .reduce<unknown>(
      (acc, key) => (acc as Record<string, unknown>)?.[key],
      obj,
    );
  return typeof result === "string" ? result : path;
}

function getLocale(): Locale {
  if (typeof localStorage === "undefined") return "ru";
  const saved = localStorage.getItem("locale") as Locale;
  return locales.includes(saved) ? saved : "ru";
}
