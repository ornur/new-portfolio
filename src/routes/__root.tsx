import { IntlProvider } from "use-intl";
import { AppleStyleDock } from "@/components/custom/NavDock";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useLocale } from "@/i18n/LocaleStore";
import { messages } from "@/i18n/messages";
import appCss from "@/styles/index.css?url";

const RootLayout = () => {
  const lang = useLocale();
  return (
    <>
      <IntlProvider messages={messages[lang]} locale={lang}>
        <Outlet />
        <AppleStyleDock />
      </IntlProvider>
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({
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
    meta: [
      { charSet: "utf-8" },
      { content: "width=device-width, initial-scale=1", name: "viewport" },
      { content: "website", name: "og:type" },
      // Fallback og:image for any route that doesn't set its own
      { content: "https://nurda.vercel.app/opengraph-image.png", name: "og:image" },
    ],
  }),
});
