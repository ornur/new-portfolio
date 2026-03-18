import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { IntlProvider } from "use-intl";

import { AppleStyleDock } from "@/components/custom/NavDock";
import { useLocale } from "@/i18n/LocaleStore";
import { messages } from "@/i18n/messages";
import appCss from "@/styles/index.css?url";

type TRootContext = {
  theme: "dark" | "light";
};

const RootLayout = () => {
  const lang = useLocale();
  return (
    <>
      <IntlProvider locale={lang} messages={messages[lang]}>
        <HeadContent />
        <Outlet />
        <AppleStyleDock />
      </IntlProvider>
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRouteWithContext<TRootContext>()({
  component: RootLayout,
  head: () => ({
    links: [
      { href: appCss, rel: "stylesheet" },
      {
        href: "/apple-touch-icon.png",
        rel: "apple-touch-icon",
        sizes: "180x180",
      },
      { color: "#e2f72e", href: "/site.webmanifest", rel: "manifest" },
      { href: "/favicon.ico", rel: "icon" },
    ],
  }),
});
