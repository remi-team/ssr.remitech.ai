import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { PAGE_META } from "@/lib/seo";
import { requestOrigin } from "@/lib/seo-origin";
import { toIso8601 } from "@/lib/structured-data";
import { newsServerService } from "@/services/server/news-server-service";
import { isValidArticleId } from "@/lib/news-id";
import { BUSINESS_CODE } from "@/lib/api/config";
import type { NewsItem } from "@/lib/api/types";

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

async function newsArticles(): Promise<Map<string, Date | undefined>> {
  const out = new Map<string, Date | undefined>();
  try {
    const [events, linkedin] = await Promise.all([
      newsServerService.getEvents({ current: 1, size: 100 }),
      newsServerService.getLinkedin({ current: 1, size: 100 }),
    ]);
    for (const res of [events, linkedin]) {
      if (res.code !== BUSINESS_CODE.SUCCESS) continue;
      for (const item of (res.data?.records ?? []) as NewsItem[]) {
        // Id-less LinkedIn posts are external-only — publishing `/news/undefined`
        // here would put a soft-404 straight into the index (QA BUG-04).
        if (!isValidArticleId(item.id)) continue;
        if (!out.has(String(item.id))) {
          out.set(String(item.id), articleLastModified(item));
        }
      }
    }
  } catch {
    // Never let a backend hiccup break the sitemap — static pages still ship.
  }
  return out;
}

/**
 * Real edit time of an article: `updateTime` wins, falling back to the
 * publication time. `undefined` when the backend gives us nothing parseable —
 * a missing `<lastmod>` is honest, a fabricated one is not.
 */
function articleLastModified(item: NewsItem): Date | undefined {
  const raw =
    (item.updateTime as string | undefined) ??
    (item.publishTime as string | undefined) ??
    item.date;
  const iso = toIso8601(raw);
  if (!iso) return undefined;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await requestOrigin();

  // Static pages carry no `<lastmod>`: we have no trustworthy edit date for
  // them, and a value that moves on every request (the old `new Date()`) is
  // worse than none — crawlers learn to ignore the field entirely
  // (2026-09-15 re-test, 技术SEO-2).
  const allPaths: { path: string; lastModified?: Date }[] = [
    ...Object.values(PAGE_META)
      .filter((m) => m.indexable)
      .map((m) => ({ path: m.path })),
    ...[...(await newsArticles())].map(([id, lastModified]) => ({
      path: `/news/${id}`,
      lastModified,
    })),
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    for (const { path, lastModified } of allPaths) {
      const url = new URL(`${prefix}${path === "/" ? "/" : path}`, origin).toString();
      const isHome = path === "/";
      const isArticle = path.startsWith("/news/");
      entries.push({
        url,
        ...(lastModified ? { lastModified } : {}),
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
