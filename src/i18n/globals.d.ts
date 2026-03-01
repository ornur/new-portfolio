import type { locales } from "./LocaleStore";
import messages from "./messages/en.json";

declare module "use-intl" {
  interface AppConfig {
    Messages: typeof messages;
    Locale: (typeof locales)[number];
  }
}
