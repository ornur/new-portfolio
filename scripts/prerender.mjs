/**
 * Post-build prerender script.
 *
 * Problem: This is a SPA, so crawlers and no-JS users initially receive an app
 * shell instead of the portfolio content that matters for search.
 *
 * Solution: After `vite build`, generate a separate index.html for each route
 * with route-specific metadata and a lightweight static body fallback. Vercel
 * serves the static file for a matching path before falling back to the SPA.
 *
 * Add a new route: copy the ROUTES entry below and update build.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../dist");

// ── Route definitions ────────────────────────────────────────────────────────

const SITE_URL = "https://nurda.dev";
const DEFAULT_IMAGE = `${SITE_URL}/opengraph-image.png`;
const PROFILE_LINKS = {
  github: "https://github.com/ornur",
  linkedin: "https://www.linkedin.com/in/ornur/",
  telegram: "https://t.me/nurda_oryn",
};
const BUILD_DATE = new Date().toISOString().slice(0, 10);

const PERSON_SCHEMA = {
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
    "Vite",
    "Docker",
  ],
  name: "Nurdaulet Orynbassarov",
  sameAs: [
    PROFILE_LINKS.github,
    PROFILE_LINKS.linkedin,
    PROFILE_LINKS.telegram,
  ],
  url: SITE_URL,
  worksFor: {
    "@type": "Organization",
    name: "LLP Digital Bridge",
  },
};

const ROUTES = [
  {
    description:
      "Nurdaulet Orynbassarov is a middle frontend developer in Astana, Kazakhstan, building React, TypeScript, and modern web applications.",
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
    image: DEFAULT_IMAGE,
    path: "/",
    priority: "1.0",
    structuredData: [PERSON_SCHEMA],
    title: "Nurdaulet Orynbassarov | Middle Frontend Developer",
    url: `${SITE_URL}/`,
  },
  {
    description:
      "Explore the tech stack of Nurdaulet Orynbassarov, a frontend developer specializing in React, TypeScript, and modern web technologies.",
    fallback: {
      heading: "Tech Stack",
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
          items: ["Tailwind CSS", "shadcn/ui", "Motion", "Docker", "Vercel"],
        },
      ],
    },
    image: DEFAULT_IMAGE,
    path: "/tech-stack",
    priority: "0.8",
    title: "Tech Stack - Nurdaulet | Middle Frontend Developer",
    url: `${SITE_URL}/tech-stack`,
  },
  {
    description:
      "Discover the professional journey and work experience of Nurdaulet Orynbassarov.",
    fallback: {
      heading: "Experience",
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
    image: DEFAULT_IMAGE,
    path: "/experience",
    priority: "0.8",
    title: "Experience - Nurdaulet | Middle Frontend Developer",
    url: `${SITE_URL}/experience`,
  },
  {
    description:
      "Check out the projects and accomplishments of Nurdaulet Orynbassarov, a frontend developer with a passion for React and TypeScript.",
    fallback: {
      heading: "Projects",
      intro:
        "Selected frontend projects by Nurdaulet Orynbassarov with source code and live demos.",
      links: [
        ["Neo Home demo", "https://neohouse.vercel.app/"],
        ["Alibi Portfolio demo", "https://alibialisher.kz/"],
        ["Creative Lab demo", "https://www.creative-hub.kz/"],
        ["SAAS Project demo", "https://saas-next-framer-motion.vercel.app/"],
        ["Lets Car demo", "https://lets-car.vercel.app/"],
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
    image: DEFAULT_IMAGE,
    path: "/projects",
    priority: "0.8",
    title: "Projects - Nurdaulet | Middle Frontend Developer",
    url: `${SITE_URL}/projects`,
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildFallbackHtml({ fallback }) {
  const links = fallback.links?.length
    ? `<nav aria-label="Profile and project links">
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
  description,
  image,
  structuredData = [],
  title,
  url,
}) {
  const schemas = structuredData
    .map(
      (schema) =>
        `<script type="application/ld+json">${JSON.stringify(schema)}</script>`,
    )
    .join("\n    ");

  return `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${url}" />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:site_name" content="Nurdaulet Orynbassarov" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    ${schemas}`.trimStart();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// Replace everything between the two sentinel comments in index.html.
// The sentinel comments are injected by the Vite HTML transform below.
const META_RE = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/;

function buildSitemap() {
  const urls = ROUTES.map((route) => {
    const loc = route.path === "/" ? `${SITE_URL}/` : route.url;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
>
${urls}
</urlset>
`;
}

function injectFallback(template, route) {
  return template.replace(
    /<div id="root">[\s\S]*?<\/div>/,
    `<div id="root">${buildFallbackHtml(route)}</div>`,
  );
}

function injectMeta(template, route) {
  const block = `<!-- seo:start -->\n    ${buildMetaBlock(route)}\n    <!-- seo:end -->`;
  return template.replace(META_RE, block);
}

// ── Main ─────────────────────────────────────────────────────────────────────

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
  const html = injectFallback(injectMeta(template, route), route);
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
