import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactLenis } from "lenis/react";
import { useEffect } from "react";
import { IntlProvider } from "use-intl";

import { AppleStyleDock } from "@/features/nav/NavDock";
import { syncLocaleFromPath, useLocale } from "@/i18n/LocaleStore";
import { messages } from "@/i18n/messages";
import appCss from "@/styles/index.css?url";

type TRootContext = {
  theme: "dark" | "light";
};

const profileSkills = [
  "Frontend Development",
  "React",
  "Next.js",
  "TypeScript",
  "TanStack Router",
  "Tailwind CSS",
  "React Query",
  "Vite",
  "Docker",
];

const RootLayout = () => {
  const { pathname } = useLocation();
  const lang = useLocale();

  useEffect(() => {
    syncLocaleFromPath(pathname);
  }, [pathname]);

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
          "@type": "ProfilePage",
          dateCreated: "2025-12-06T17:39:58+05:00",
          dateModified: new Date().toISOString(),
          mainEntity: {
            "@type": "Person",
            address: {
              "@type": "PostalAddress",
              addressCountry: "Kazakhstan",
              addressLocality: "Astana",
            },
            alternateName: [
              "Nurdaulet Orynbasarov",
              "Нурдаулет Орынбасаров",
              "Нұрдәулет Орынбасаров",
              "Nurdáýlet Orynbasarov",
            ],
            alumniOf: {
              "@type": "CollegeOrUniversity",
              name: "Astana IT University",
            },
            description:
              "Nurdaulet Orynbassarov is a middle frontend developer in Astana, Kazakhstan, building React, TypeScript, and modern web applications.",
            identifier: "nurdaulet-orynbassarov-portfolio",
            image: "https://nurda.dev/opengraph-image.png",
            jobTitle: "Middle Frontend Developer",
            knowsAbout: profileSkills,
            name: "Nurdaulet Orynbassarov",
            nationality: {
              "@type": "Country",
              name: "Kazakhstan",
            },
            sameAs: [
              "https://github.com/ornur",
              "https://www.linkedin.com/in/ornur/",
              "https://t.me/nurda_oryn",
            ],
            skills: profileSkills,
            url: "https://nurda.dev",
            worksFor: {
              "@type": "Organization",
              name: "LLP Digital Bridge",
            },
          },
        }),
        type: "application/ld+json",
      },
    ],
  }),
});
