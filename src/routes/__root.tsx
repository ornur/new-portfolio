import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactLenis } from "lenis/react";
import { IntlProvider } from "use-intl";

import { AppleStyleDock } from "@/features/nav/NavDock";
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
        <ReactLenis root>
          <HeadContent />
          <Outlet />
          <AppleStyleDock />
        </ReactLenis>
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
    scripts: [
      {
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          address: {
            "@type": "PostalAddress",
            addressCountry: "Kazakhstan",
            addressLocality: "Astana",
          },
          alumniOf: {
            "@type": "CollegeOrUniversity",
            name: "Astana IT University",
          },
          jobTitle: "Middle Frontend Developer",
          knowsAbout: [
            "Frontend Development",
            "React",
            "Next.js",
            "TypeScript",
            "TanStack Router",
            "Tailwind CSS",
            "React Query",
            "Vite",
            "Docker",
          ],
          name: "Nurdaulet Orynbassarov",
          sameAs: [
            "https://github.com/ornur",
            "https://www.linkedin.com/in/ornur/",
            "https://t.me/nurda_oryn",
          ],
          url: "https://nurda.dev",
          worksFor: {
            "@type": "Organization",
            name: "LLP Digital Bridge",
          },
        }),
        type: "application/ld+json",
      },
    ],
  }),
});
