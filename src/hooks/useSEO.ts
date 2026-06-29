import { useEffect } from "react";

import {
  defaultLocale,
  localizePath,
  stripLocaleFromPath,
} from "../i18n/localePaths";
import { useLocale } from "../i18n/LocaleStore";

interface SeoProps {
  description: string;
  title: string;
}

export function useSEO({ description, title }: SeoProps) {
  const locale = useLocale();

  useEffect(() => {
    const path = window.location.pathname;
    const canonicalUrl = `https://nurda.dev${path}`;
    const basePath = stripLocaleFromPath(path);

    // Update the document title
    document.title = title;

    // Helper to update or create meta tags
    const setMetaTag = (
      attrName: string,
      attrValue: string,
      content: string,
    ) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    const setLinkTag = (
      rel: string,
      href: string,
      attributes: Record<string, string> = {},
    ) => {
      const selector =
        rel === "alternate" && attributes.hreflang
          ? `link[rel="${rel}"][hreflang="${attributes.hreflang}"]`
          : `link[rel="${rel}"]`;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
      element.setAttribute("href", href);
    };

    // Update standard description
    setMetaTag("name", "description", description);
    setMetaTag("name", "robots", "index, follow");
    setLinkTag("canonical", canonicalUrl);
    setLinkTag(
      "alternate",
      `https://nurda.dev${localizePath(basePath, "en")}`,
      {
        hreflang: "en",
      },
    );
    setLinkTag(
      "alternate",
      `https://nurda.dev${localizePath(basePath, "ru")}`,
      {
        hreflang: "ru",
      },
    );
    setLinkTag(
      "alternate",
      `https://nurda.dev${localizePath(basePath, "kk")}`,
      {
        hreflang: "kk",
      },
    );
    setLinkTag(
      "alternate",
      `https://nurda.dev${localizePath(basePath, defaultLocale)}`,
      {
        hreflang: "x-default",
      },
    );

    // Update Open Graph tags (optional, mainly if tools like Telegram read them post-load)
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", canonicalUrl);

    // Update Twitter tags
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
  }, [title, description, locale]); // Re-run whenever title, description, or locale changes
}
