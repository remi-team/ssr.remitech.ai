import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { routing, AVAILABLE_LOCALES } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import { toIso8601 } from "@/lib/structured-data";
import { BUSINESS_CODE } from "@/lib/api/config";
import type { NewsItem } from "@/lib/api/types";
import { newsServerService } from "@/services/server/news-server-service";
import { isValidArticleId } from "@/lib/news-id";
import { BreadcrumbJsonLd, NewsArticleJsonLd } from "@/components/seo/json-ld";
import { NewsDetailContent } from "./_components/news-detail-content";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

/**
 * Request-dependent by design — do NOT re-add `revalidate` / `generateStaticParams`.
 *
 * Every render reads the visitor's cookies via `getAccessToken()` (awaited
 * `cookies()` ⇒ `connection()`). With the previous `revalidate = 300` +
 * build-time prerendering, Next recorded the per-id pages as fully static;
 * at request time the cookie read awaited `connection()` and Next hard-500s
 * the static→dynamic flip in production
 * (SIT `/news/{403,400,399}` — "Page changed from static to dynamic at
 * runtime, reason: connection", app-static-to-dynamic-error).
 *
 * Freshness is still covered at the edge: NEWS_CACHE in next.config.ts sets
 * `s-maxage=300` for `/news*`, so the CDN keeps the 5-minute crawl cadence.
 */
export const dynamic = "force-dynamic";

/**
 * News detail page — migrated from the legacy Vue `views/newsDetail/index.vue`.
 *
 * Data strategy (mirrors the legacy load flow):
 *  1. Fetch the article detail via the news detail BFF.
 *  2. Fallback: search the events + linkedin lists for the id (legacy store
 *     fallback).
 *  3. Not found anywhere → return 404 via notFound().
 */

async function loadArticle(id: string): Promise<NewsItem | null> {
  if (!isValidArticleId(id)) return null;

  try {
    const res = await newsServerService.getDetail(id);
    if (res.code === BUSINESS_CODE.SUCCESS && res.data) {
      return res.data;
    }
  } catch {
    // Fall through to the list lookup below.
  }

  try {
    const [eventsRes, linkedinRes] = await Promise.all([
      newsServerService.getEvents({ current: 1, size: 20 }),
      newsServerService.getLinkedin({ current: 1, size: 20 }),
    ]);
    const all = [...(eventsRes.data?.records ?? []), ...(linkedinRes.data?.records ?? [])];
    // `item.id != null` is load-bearing: the LinkedIn feed ships id-less
    // records and a loose `String(a.id) === String(id)` comparison used to
    // resolve `/news/undefined` onto the first one.
    return all.find((a) => a.id != null && String(a.id) === id) ?? null;
  } catch {
    return null;
  }
}

/** Cover image, in the two field shapes the website API uses. */
function articleImage(article: NewsItem): string | undefined {
  const raw = (article.imageUrl as string | undefined) ?? article.cover;
  return raw && raw.trim() ? raw : undefined;
}

/** Publication timestamp, in the two field shapes the website API uses. */
function articleDate(article: NewsItem): string | undefined {
  const raw = (article.publishTime as string | undefined) ?? article.date;
  return raw && String(raw).trim() ? String(raw) : undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale) ? locale : routing.defaultLocale;
  const article = await loadArticle(id);
  return buildPageMetadata(validLocale, "news", {
    title: article?.title ? `${article.title} — Remi` : undefined,
    description: article?.summary || undefined,
    path: `/news/${id}`,
    // Press releases are articles, not generic websites (QA BUG-16).
    ogType: "article",
    image: article ? articleImage(article) : undefined,
    // ISO 8601 publish/update time -> article:published_time / :modified_time,
    // which Google News uses for freshness (QA BUG-03).
    publishedTime: article ? toIso8601(articleDate(article)) : undefined,
    modifiedTime: article
      ? toIso8601((article.updateTime as string | undefined) ?? undefined)
      : undefined,
  });
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  const article = await loadArticle(id);
  if (!article) {
    notFound();
  }

  const path = `/news/${id}`;

  return (
    <div className="min-h-screen bg-[#f2efec] text-[#2c2520]">
      {/* NewsArticle + BreadcrumbList structured data (QA BUG-02 / BUG-03).
          Rendered as real SSR `<script>` elements, ISO 8601 dates, absolute
          image URL. */}
      <NewsArticleJsonLd
        input={{
          headline: article.title,
          description: article.summary ?? "",
          publishedAt: articleDate(article),
          modifiedAt: (article.updateTime as string | undefined) ?? undefined,
          image: articleImage(article),
          path,
        }}
      />
      <BreadcrumbJsonLd path={path} label={article.title} />
      <NewsDetailContent article={article} />
    </div>
  );
}
