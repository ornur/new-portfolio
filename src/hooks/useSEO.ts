import { useEffect } from "react";

import { useLocale } from "../i18n/LocaleStore";

interface SeoProps {
  description: string;
  title: string;
}

export function useSEO({ description, title }: SeoProps) {
  const locale = useLocale();

  useEffect(() => {
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

    // Update standard description
    setMetaTag("name", "description", description);

    // Update Open Graph tags (optional, mainly if tools like Telegram read them post-load)
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);

    // Update Twitter tags
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
  }, [title, description, locale]); // Re-run whenever title, description, or locale changes
}
