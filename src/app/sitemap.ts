import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";

/**
 * Programmatic sitemap.xml.
 *
 * Emits one entry per supported locale (with correct hreflang-style alternates
 * via the `alternates` field) so search engines pick the right language URL.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routing.locales.map((locale) => {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    const url = new URL(`${prefix}/`, siteConfig.url).toString();

    return {
      url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: locale === routing.defaultLocale ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => {
            const p = l === routing.defaultLocale ? "" : `/${l}`;
            return [l, new URL(`${p}/`, siteConfig.url).toString()];
          })
        ),
      },
    };
  });
}
