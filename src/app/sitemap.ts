import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { PAGE_META } from "@/lib/seo";
import { requestOrigin } from "@/lib/seo-origin";
import { newsServerService } from "@/services/server/news-server-service";
import { isValidArticleId } from "@/lib/news-id";
import { BUSINESS_CODE } from "@/lib/api/config";

/**
 * Programmatic sitemap.xml.
 *
 * Covers:
 *  • every public static page (from `PAGE_META`), per locale, with hreflang
 *    alternates;
 *  • every news article detail page (`/news/{id}`) fetched live from the
 *    website API service.
 *
 * Excluded by design: login / reset-password flows, `/api/*`, `/player`
 * (authenticated media only — filtered via `indexable: false`).
 *
 * `force-dynamic` for two reasons (QA BUG-17): the `<loc>` host has to be the
 * host actually serving the file rather than whatever `SITE_URL` defaulted to
 * during the image build, and newly published articles must become discoverable
 * without a redeploy.
 */
export const dynamic = "force-dynamic";

async function newsArticlePaths(): Promise<string[]> {
  try {
    const [events, linkedin] = await Promise.all([
      newsServerService.getEvents({ current: 1, size: 100 }),
      newsServerService.getLinkedin({ current: 1, size: 100 }),
    ]);
    const ids = new Set<string>();
    for (const res of [events, linkedin]) {
      if (res.code !== BUSINESS_CODE.SUCCESS) continue;
      for (const item of res.data?.records ?? []) {
        // Id-less LinkedIn posts are external-only — publishing `/news/undefined`
        // here would put a soft-404 straight into the index (QA BUG-04).
        if (isValidArticleId(item.id)) ids.add(String(item.id));
      }
    }
    return [...ids].map((id) => `/news/${id}`);
  } catch {
    // Never let a backend hiccup break the sitemap — static pages still ship.
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const origin = await requestOrigin();

  const staticPaths = Object.values(PAGE_META)
    .filter((m) => m.indexable)
    .map((m) => m.path);

  const articlePaths = await newsArticlePaths();
  const allPaths = [...staticPaths, ...articlePaths];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    for (const path of allPaths) {
      const url = new URL(`${prefix}${path === "/" ? "/" : path}`, origin).toString();
      const isHome = path === "/";
      const isArticle = path.startsWith("/news/");
      entries.push({
        url,
        lastModified: now,
        changeFrequency: isArticle ? "monthly" : isHome ? "weekly" : "monthly",
        priority: isHome ? 1 : isArticle ? 0.7 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => {
              const p = l === routing.defaultLocale ? "" : `/${l}`;
              return [l, new URL(`${p}${path}`, origin).toString()];
            }),
          ),
        },
      });
    }
  }

  return entries;
}
