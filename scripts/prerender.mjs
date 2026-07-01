/**
 * Post-build prerender script.
 *
 * Generates crawlable HTML for every route and locale. The React app still
 * hydrates normally, but crawlers receive localized metadata, hreflang links,
 * JSON-LD, and fallback body content before JavaScript runs.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../dist");

const SITE_URL = "https://nurda.dev";
const DEFAULT_IMAGE = `${SITE_URL}/opengraph-image.png`;
const BUILD_DATE = new Date().toISOString().slice(0, 10);
const PROFILE_DATE_CREATED = "2025-12-06T17:39:58+05:00";

const PROFILE_LINKS = {
  github: "https://github.com/ornur",
  linkedin: "https://www.linkedin.com/in/ornur/",
  telegram: "https://t.me/nurda_oryn",
};

const LOCALES = {
  en: {
    label: "English",
    prefix: "",
  },
  kk: {
    label: "Kazakh",
    prefix: "/kk",
  },
  ru: {
    label: "Russian",
    prefix: "/ru",
  },
};

const NAME_VARIANTS = [
  "Nurdaulet Orynbassarov",
  "Nurdaulet Orynbasarov",
  "Нурдаулет Орынбасаров",
  "Нұрдәулет Орынбасаров",
  "Nurdáýlet Orynbasarov",
];

const PROFILE_SKILLS = [
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

const PROFILE_SCHEMA_BY_LOCALE = {
  en: buildProfileSchema({
    description:
      "Nurdaulet Orynbassarov is a middle frontend developer in Astana, Kazakhstan, building React, TypeScript, and modern web applications.",
    jobTitle: "Middle Frontend Developer",
    name: "Nurdaulet Orynbassarov",
  }),
  kk: buildProfileSchema({
    description:
      "Нұрдәулет Орынбасаров - Астана, Қазақстандағы frontend әзірлеушісі. React және TypeScript жобалары, дағдылары және тәжірибесі.",
    jobTitle: "Frontend әзірлеушісі",
    name: "Нұрдәулет Орынбасаров",
  }),
  ru: buildProfileSchema({
    description:
      "Нурдаулет Орынбасаров - frontend разработчик из Астаны, Казахстан. Портфолио Нурдаулета Орынбасарова с проектами, навыками и опытом разработки на React и TypeScript.",
    jobTitle: "Frontend разработчик",
    name: "Нурдаулет Орынбасаров",
  }),
};

const PAGES = [
  {
    key: "home",
    path: "/",
    priority: "1.0",
    translations: {
      en: {
        description:
          "Nurdaulet Orynbassarov, also searched as Nurdaulet Orynbasarov, is a middle frontend developer in Astana, Kazakhstan, building React, TypeScript, and modern web applications.",
        fallback: {
          heading: "Nurdaulet Orynbassarov",
          intro:
            "Middle Frontend Developer based in Astana, Kazakhstan. I build polished web applications with React, TypeScript, Next.js, TanStack, Tailwind CSS, and Vite.",
          links: [
            ["GitHub", PROFILE_LINKS.github],
            ["LinkedIn", PROFILE_LINKS.linkedin],
            ["Telegram", PROFILE_LINKS.telegram],
          ],
          sections: [
            {
              heading: "Name variants",
              items: NAME_VARIANTS,
            },
            {
              heading: "Core Stack",
              items: [
                "React and TypeScript frontend development",
                "Next.js, Vite, TanStack Router, React Query, and Tailwind CSS",
                "Accessible UI systems, dashboards, marketplaces, and portfolio websites",
              ],
            },
            {
              heading: "Current Role",
              items: [
                "Middle Frontend Developer at LLP Digital Bridge",
                "Software Engineering alumnus of Astana IT University",
              ],
            },
          ],
        },
        title: "Nurdaulet Orynbassarov | Middle Frontend Developer",
      },
      kk: {
        description:
          "Нұрдәулет Орынбасаров - Астана, Қазақстандағы frontend әзірлеушісі. React және TypeScript жобалары, дағдылары және тәжірибесі.",
        fallback: {
          heading: "Нұрдәулет Орынбасаров",
          intro:
            "Астана, Қазақстандағы frontend әзірлеушісі. Мен React, TypeScript, Next.js, TanStack, Tailwind CSS және Vite арқылы заманауи веб-қосымшалар жасаймын.",
          links: [
            ["GitHub", PROFILE_LINKS.github],
            ["LinkedIn", PROFILE_LINKS.linkedin],
            ["Telegram", PROFILE_LINKS.telegram],
          ],
          sections: [
            {
              heading: "Есім нұсқалары",
              items: NAME_VARIANTS,
            },
            {
              heading: "Негізгі стек",
              items: [
                "React және TypeScript frontend әзірлеу",
                "Next.js, Vite, TanStack Router, React Query және Tailwind CSS",
                "Қолжетімді UI жүйелері, dashboard, marketplace және portfolio сайттары",
              ],
            },
            {
              heading: "Қазіргі жұмыс",
              items: [
                "ЖШС Digital Bridge компаниясында Middle Frontend әзірлеушісі",
                "Astana IT University Software Engineering түлегі",
              ],
            },
          ],
        },
        title: "Нұрдәулет Орынбасаров | Frontend әзірлеушісі",
      },
      ru: {
        description:
          "Нурдаулет Орынбасаров - frontend разработчик из Астаны, Казахстан. Портфолио Нурдаулета Орынбасарова с проектами, навыками и опытом разработки на React и TypeScript.",
        fallback: {
          heading: "Нурдаулет Орынбасаров",
          intro:
            "Frontend разработчик из Астаны, Казахстан. Я создаю современные веб-приложения на React, TypeScript, Next.js, TanStack, Tailwind CSS и Vite.",
          links: [
            ["GitHub", PROFILE_LINKS.github],
            ["LinkedIn", PROFILE_LINKS.linkedin],
            ["Telegram", PROFILE_LINKS.telegram],
          ],
          sections: [
            {
              heading: "Варианты имени",
              items: NAME_VARIANTS,
            },
            {
              heading: "Основной стек",
              items: [
                "Frontend разработка на React и TypeScript",
                "Next.js, Vite, TanStack Router, React Query и Tailwind CSS",
                "Доступные UI-системы, dashboard, marketplace и portfolio сайты",
              ],
            },
            {
              heading: "Текущая роль",
              items: [
                "Middle Frontend Developer в ТОО Digital Bridge",
                "Выпускник Software Engineering в Astana IT University",
              ],
            },
          ],
        },
        title: "Нурдаулет Орынбасаров | Frontend разработчик",
      },
    },
  },
  {
    key: "tech-stack",
    path: "/tech-stack",
    priority: "0.8",
    translations: {
      en: {
        description:
          "Explore the technologies and tools that Nurdaulet Orynbassarov uses in his software development projects.",
        fallback: {
          heading: "Tech Stack - Nurdaulet Orynbassarov",
          intro:
            "Technologies and tools Nurdaulet Orynbassarov uses to build modern frontend applications.",
          sections: [
            {
              heading: "Frontend",
              items: [
                "React",
                "TypeScript",
                "Next.js",
                "TanStack Router",
                "React Query",
                "Vite",
              ],
            },
            {
              heading: "UI and Delivery",
              items: [
                "Tailwind CSS",
                "shadcn/ui",
                "Motion",
                "Docker",
                "Vercel",
              ],
            },
          ],
        },
        title: "Tech Stack - Nurdaulet Orynbassarov",
      },
      kk: {
        description:
          "Нұрдәулет Орынбасаров бағдарламалық жасақтама әзірлеу жобаларында қолданатын технологиялар мен құралдарды қараңыз.",
        fallback: {
          heading: "Технологиялар стекі - Нұрдәулет Орынбасаров",
          intro:
            "Нұрдәулет Орынбасаров заманауи frontend қосымшаларын жасау үшін қолданатын технологиялар мен құралдар.",
          sections: [
            {
              heading: "Frontend",
              items: [
                "React",
                "TypeScript",
                "Next.js",
                "TanStack Router",
                "React Query",
                "Vite",
              ],
            },
            {
              heading: "UI және жеткізу",
              items: [
                "Tailwind CSS",
                "shadcn/ui",
                "Motion",
                "Docker",
                "Vercel",
              ],
            },
          ],
        },
        title: "Технологиялар стекі - Нұрдәулет Орынбасаров",
      },
      ru: {
        description:
          "Изучите технологии и инструменты, которые Нурдаулет Орынбасаров использует в своих проектах по разработке программного обеспечения.",
        fallback: {
          heading: "Стек технологий - Нурдаулет Орынбасаров",
          intro:
            "Технологии и инструменты, которые Нурдаулет Орынбасаров использует для создания современных frontend приложений.",
          sections: [
            {
              heading: "Frontend",
              items: [
                "React",
                "TypeScript",
                "Next.js",
                "TanStack Router",
                "React Query",
                "Vite",
              ],
            },
            {
              heading: "UI и доставка",
              items: [
                "Tailwind CSS",
                "shadcn/ui",
                "Motion",
                "Docker",
                "Vercel",
              ],
            },
          ],
        },
        title: "Стек технологий - Нурдаулет Орынбасаров",
      },
    },
  },
  {
    key: "experience",
    path: "/experience",
    priority: "0.8",
    translations: {
      en: {
        description:
          "Discover the professional journey and work experience of Nurdaulet Orynbassarov.",
        fallback: {
          heading: "Experience - Nurdaulet Orynbassarov",
          intro:
            "Professional frontend development experience for Nurdaulet Orynbassarov.",
          sections: [
            {
              heading: "LLP Digital Bridge",
              items: [
                "Middle Frontend Developer, Astana, Kazakhstan",
                "Sep 2025 - Present",
                "Developing a state-mandated school nutrition control system with React, Vite, TanStack Router, Zod, and React Query.",
              ],
            },
            {
              heading: "ZIZ INC.",
              items: [
                "Frontend Developer, Astana, Kazakhstan",
                "Jun 2023 - Jun 2025",
                "Built admin dashboards, AI chatbot analytics interfaces, chemical marketplace features, custom calculators, and dynamic galleries.",
              ],
            },
          ],
        },
        title: "Experience - Nurdaulet Orynbassarov",
      },
      kk: {
        description:
          "Нұрдәулет Орынбасаровтың кәсіби жолы мен жұмыс тәжірибесін қараңыз.",
        fallback: {
          heading: "Тәжірибе - Нұрдәулет Орынбасаров",
          intro:
            "Нұрдәулет Орынбасаровтың frontend әзірлеу саласындағы кәсіби тәжірибесі.",
          sections: [
            {
              heading: "ЖШС Digital Bridge",
              items: [
                "Middle Frontend әзірлеушісі, Астана, Қазақстан",
                "Қыркүйек 2025 - қазіргі уақытқа дейін",
                "React, Vite, TanStack Router, Zod және React Query қолданып мектеп тамақтануын бақылау жүйесін әзірлеу.",
              ],
            },
            {
              heading: "ZIZ INC.",
              items: [
                "Frontend әзірлеушісі, Астана, Қазақстан",
                "Маусым 2023 - Маусым 2025",
                "Dashboard, AI chatbot аналитикасы, marketplace мүмкіндіктері, калькуляторлар және динамикалық галереялар жасау.",
              ],
            },
          ],
        },
        title: "Тәжірибе - Нұрдәулет Орынбасаров",
      },
      ru: {
        description:
          "Узнайте больше о профессиональном пути и опыте работы Нурдаулета Орынбасарова.",
        fallback: {
          heading: "Опыт - Нурдаулет Орынбасаров",
          intro:
            "Профессиональный опыт Нурдаулета Орынбасарова во frontend разработке.",
          sections: [
            {
              heading: "ТОО Digital Bridge",
              items: [
                "Middle Frontend Developer, Астана, Казахстан",
                "Сентябрь 2025 - по настоящее время",
                "Разработка системы контроля школьного питания с React, Vite, TanStack Router, Zod и React Query.",
              ],
            },
            {
              heading: "ZIZ INC.",
              items: [
                "Frontend Developer, Астана, Казахстан",
                "Июнь 2023 - июнь 2025",
                "Разработка dashboard, интерфейсов AI chatbot аналитики, marketplace функций, калькуляторов и динамических галерей.",
              ],
            },
          ],
        },
        title: "Опыт - Нурдаулет Орынбасаров",
      },
    },
  },
  {
    key: "projects",
    path: "/projects",
    priority: "0.8",
    translations: {
      en: {
        description:
          "Explore the software projects that Nurdaulet Orynbassarov has worked on.",
        fallback: {
          heading: "Projects - Nurdaulet Orynbassarov",
          intro:
            "Selected frontend projects by Nurdaulet Orynbassarov with source code and live demos.",
          links: [
            ["Neo Home demo", "https://neohouse.nurda.dev/"],
            ["Alibi Portfolio demo", "https://alibialisher.kz/"],
            ["Creative Lab demo", "https://www.creative-hub.kz/"],
            ["SAAS Project demo", "https://saas.nurda.dev/"],
            ["Lets Car demo", "https://lets-car.nurda.dev/"],
          ],
          sections: [
            {
              heading: "Project Code",
              items: [
                "Neo Home - https://github.com/ornur/neohome",
                "Alibi Portfolio - https://github.com/ornur/alibi-portfolio",
                "Creative Lab - https://github.com/ornur/creative-lab",
                "SAAS Project - https://github.com/ornur/saasNextFramerMotion",
                "Lets Car - https://github.com/ornur/lets_car_frontend",
              ],
            },
          ],
        },
        title: "Projects - Nurdaulet Orynbassarov",
      },
      kk: {
        description:
          "Нұрдәулет Орынбасаров жұмыс істеген бағдарламалық жасақтама жобаларымен танысыңыз.",
        fallback: {
          heading: "Жобалар - Нұрдәулет Орынбасаров",
          intro:
            "Нұрдәулет Орынбасаров жасаған таңдаулы frontend жобалары, source code және live demo сілтемелері.",
          links: [
            ["Neo Home demo", "https://neohouse.nurda.dev/"],
            ["Alibi Portfolio demo", "https://alibialisher.kz/"],
            ["Creative Lab demo", "https://www.creative-hub.kz/"],
            ["SAAS Project demo", "https://saas.nurda.dev/"],
            ["Lets Car demo", "https://lets-car.nurda.dev/"],
          ],
          sections: [
            {
              heading: "Жоба кодтары",
              items: [
                "Neo Home - https://github.com/ornur/neohome",
                "Alibi Portfolio - https://github.com/ornur/alibi-portfolio",
                "Creative Lab - https://github.com/ornur/creative-lab",
                "SAAS Project - https://github.com/ornur/saasNextFramerMotion",
                "Lets Car - https://github.com/ornur/lets_car_frontend",
              ],
            },
          ],
        },
        title: "Жобалар - Нұрдәулет Орынбасаров",
      },
      ru: {
        description:
          "Изучите программные проекты, над которыми работал Нурдаулет Орынбасаров.",
        fallback: {
          heading: "Проекты - Нурдаулет Орынбасаров",
          intro:
            "Избранные frontend проекты Нурдаулета Орынбасарова с исходным кодом и live demo.",
          links: [
            ["Neo Home demo", "https://neohouse.nurda.dev/"],
            ["Alibi Portfolio demo", "https://alibialisher.kz/"],
            ["Creative Lab demo", "https://www.creative-hub.kz/"],
            ["SAAS Project demo", "https://saas.nurda.dev/"],
            ["Lets Car demo", "https://lets-car.nurda.dev/"],
          ],
          sections: [
            {
              heading: "Код проектов",
              items: [
                "Neo Home - https://github.com/ornur/neohome",
                "Alibi Portfolio - https://github.com/ornur/alibi-portfolio",
                "Creative Lab - https://github.com/ornur/creative-lab",
                "SAAS Project - https://github.com/ornur/saasNextFramerMotion",
                "Lets Car - https://github.com/ornur/lets_car_frontend",
              ],
            },
          ],
        },
        title: "Проекты - Нурдаулет Орынбасаров",
      },
    },
  },
];

const ROUTES = PAGES.flatMap((page) =>
  Object.keys(LOCALES).map((locale) => buildRoute(page, locale)),
);

const META_RE = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/;

function buildFallbackHtml({ fallback, lang }) {
  const links = fallback.links?.length
    ? `<nav aria-label="${escapeHtml(LOCALES[lang].label)} links">
        <ul>${fallback.links
          .map(
            ([label, href]) =>
              `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`,
          )
          .join("")}</ul>
      </nav>`
    : "";

  const sections = fallback.sections
    .map(
      (section) => `<section>
        <h2>${escapeHtml(section.heading)}</h2>
        <ul>${section.items
          .map((item) => `<li>${escapeHtml(item)}</li>`)
          .join("")}</ul>
      </section>`,
    )
    .join("");

  return `<main class="ssg-fallback" aria-label="Portfolio summary">
      <h1>${escapeHtml(fallback.heading)}</h1>
      <p>${escapeHtml(fallback.intro)}</p>
      ${links}
      ${sections}
    </main>`;
}

function buildMetaBlock({
  alternates,
  description,
  image,
  structuredData = [],
  title,
  url,
}) {
  const alternateLinks = alternates
    .map(
      ({ href, hreflang }) =>
        `<link rel="alternate" hreflang="${escapeHtml(hreflang)}" href="${escapeHtml(href)}" />`,
    )
    .join("\n    ");

  const schemas = structuredData
    .map(
      (schema) =>
        `<script type="application/ld+json">${JSON.stringify(schema)}</script>`,
    )
    .join("\n    ");

  return `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${escapeHtml(url)}" />
    ${alternateLinks}

    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:site_name" content="Nurdaulet Orynbassarov" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    ${schemas}`.trimStart();
}

function buildProfileSchema({ description, jobTitle, name }) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: PROFILE_DATE_CREATED,
    dateModified: new Date().toISOString(),
    mainEntity: {
      "@type": "Person",
      address: {
        "@type": "PostalAddress",
        addressCountry: "Kazakhstan",
        addressLocality: "Astana",
      },
      alternateName: NAME_VARIANTS.filter((variant) => variant !== name),
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Astana IT University",
      },
      description,
      identifier: "nurdaulet-orynbassarov-portfolio",
      image: DEFAULT_IMAGE,
      jobTitle,
      knowsAbout: PROFILE_SKILLS,
      name,
      nationality: {
        "@type": "Country",
        name: "Kazakhstan",
      },
      sameAs: [
        PROFILE_LINKS.github,
        PROFILE_LINKS.linkedin,
        PROFILE_LINKS.telegram,
      ],
      skills: PROFILE_SKILLS,
      url: SITE_URL,
      worksFor: {
        "@type": "Organization",
        name: "LLP Digital Bridge",
      },
    },
  };
}

function buildRoute(page, locale) {
  const translation = page.translations[locale];
  const path = localizePath(page.path, locale);
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;
  const alternates = Object.keys(LOCALES).map((alternateLocale) => ({
    href: `${SITE_URL}${localizePath(page.path, alternateLocale) === "/" ? "/" : localizePath(page.path, alternateLocale)}`,
    hreflang: alternateLocale,
  }));

  return {
    ...translation,
    alternates: [
      ...alternates,
      {
        href: `${SITE_URL}${page.path === "/" ? "/" : page.path}`,
        hreflang: "x-default",
      },
    ],
    image: DEFAULT_IMAGE,
    key: page.key,
    lang: locale,
    path,
    priority: page.priority,
    structuredData:
      page.key === "home" ? [PROFILE_SCHEMA_BY_LOCALE[locale]] : [],
    url,
  };
}

function buildSitemap() {
  const urls = ROUTES.map((route) => {
    const alternateLinks = route.alternates
      .map(
        ({ href, hreflang }) =>
          `    <xhtml:link rel="alternate" hreflang="${escapeHtml(hreflang)}" href="${escapeHtml(href)}" />`,
      )
      .join("\n");

    return `  <url>
    <loc>${escapeHtml(route.url)}</loc>
${alternateLinks}
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
>
${urls}
</urlset>
`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function injectFallback(template, route) {
  return template.replace(
    /<div id="root">[\s\S]*?<\/div>/,
    `<div id="root">${buildFallbackHtml(route)}</div>`,
  );
}

function injectLang(template, route) {
  return template.replace(/<html lang="[^"]*">/, `<html lang="${route.lang}">`);
}

function injectMeta(template, route) {
  const block = `<!-- seo:start -->\n    ${buildMetaBlock(route)}\n    <!-- seo:end -->`;
  return template.replace(META_RE, block);
}

function localizePath(path, locale) {
  const prefix = LOCALES[locale].prefix;
  if (!prefix) return path;
  return path === "/" ? prefix : `${prefix}${path}`;
}

const template = readFileSync(resolve(distDir, "index.html"), "utf-8");

if (!META_RE.test(template)) {
  console.warn(
    "[prerender] WARNING: sentinel comments not found in dist/index.html.\n" +
      "            Make sure the vitePluginSeoSentinels plugin is in vite.config.ts.\n" +
      "            Skipping per-route HTML generation.",
  );
  process.exit(0);
}

for (const route of ROUTES) {
  const html = injectFallback(
    injectMeta(injectLang(template, route), route),
    route,
  );
  const outDir = resolve(
    distDir,
    route.path === "/" ? "" : route.path.replace(/^\//, ""),
  );
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "index.html"), html, "utf-8");
  console.log(
    `[prerender] wrote dist${route.path === "/" ? "" : route.path}/index.html  (${route.title})`,
  );
}

writeFileSync(resolve(distDir, "sitemap.xml"), buildSitemap(), "utf-8");
console.log(`[prerender] wrote dist/sitemap.xml  (${BUILD_DATE})`);

console.log("[prerender] done.");
