/**
 * Post-build prerender script.
 *
 * Problem: This is a SPA — meta tags are injected by JS at runtime, so
 * social-media crawlers (Twitter, LinkedIn, Slack…) that don't run JS see an
 * empty <head> and can't generate link previews.
 *
 * Solution: After `vite build`, generate a separate index.html for each route
 * with the correct static meta tags already baked in. Vercel serves the static
 * file for a matching path before falling back to the catch-all rewrite, so
 * crawlers get the right tags while the SPA still boots normally in browsers.
 *
 * Add a new route: copy the ROUTES entry below and update build.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../dist");

// ── Route definitions ────────────────────────────────────────────────────────

const SITE_URL = "https://nurda.vercel.app";
const DEFAULT_IMAGE = `${SITE_URL}/opengraph-image.png`;

const ROUTES = [
  {
    description:
      "Learn more about Nurdaulet Orynbassarov — a frontend developer passionate about React, TypeScript, and building great user experiences.",
    image: DEFAULT_IMAGE,
    path: "/about",
    title: "About - Nurdaulet",
    url: `${SITE_URL}/about`,
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildMetaBlock({ description, image, title, url }) {
  return `
    <title>${title}</title>
    <meta name="description" content="${description}" />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:site_name" content="Nurdaulet Orynbassarov" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />`.trimStart();
}

// Replace everything between the two sentinel comments in index.html.
// The sentinel comments are injected by the Vite HTML transform below.
const META_RE = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/;

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
  const html = injectMeta(template, route);
  const outDir = resolve(distDir, route.path.replace(/^\//, ""));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "index.html"), html, "utf-8");
  console.log(
    `[prerender] wrote dist${route.path}/index.html  (${route.title})`,
  );
}

console.log("[prerender] done.");
