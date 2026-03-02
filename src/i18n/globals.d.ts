import type { locales } from "./LocaleStore";

import messages from "./messages/en.json";

declare module "use-intl" {
  interface AppConfig {
    Locale: (typeof locales)[number];
    Messages: typeof messages;
  }
}
