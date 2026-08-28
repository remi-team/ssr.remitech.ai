import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { isIndexable } from "@/lib/seo";

/**
 * Programmatic robots.txt — keeps crawl rules version-controlled.
 *
 * Indexing policy mirrors the metadata layer: non-production deployments
 * (`SITE_ENV` !== "production") disallow all crawling so staging/SIT domains
 * are never indexed ahead of the production site.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/player"],
      },
    ],
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
    host: siteConfig.url,
  };
}
