import { IntlProvider } from "use-intl";
import { AppleStyleDock } from "@/components/custom/NavDock";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useLocale } from "@/i18n/LocaleStore";
import { messages } from "@/i18n/messages";

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

export const Route = createRootRoute({ component: RootLayout });
