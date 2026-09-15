import type { MetadataRoute } from "next";

import { requestOrigin } from "@/lib/seo-origin";
import { isIndexable } from "@/lib/seo";

/**
 * Programmatic robots.txt — keeps crawl rules version-controlled.
 *
 * Rendered per request on purpose: one image is promoted through every
 * environment and the origin/indexing switch only exists as a runtime env var,
 * so a build-time snapshot of either would be wrong somewhere (QA BUG-17).
 *
 * Indexing policy mirrors the metadata layer: non-production deployments
 * (`SITE_ENV` !== "production") disallow all crawling so staging/SIT domains
 * are never indexed ahead of the production site.
 */
export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await requestOrigin();

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
    sitemap: new URL("/sitemap.xml", origin).toString(),
    host: origin,
  };
}
