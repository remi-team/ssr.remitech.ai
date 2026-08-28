import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { routing, AVAILABLE_LOCALES } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import { BUSINESS_CODE } from "@/lib/api/config";
import type { NewsItem } from "@/lib/api/types";
import { newsServerService } from "@/services/server/news-server-service";
import { NewsDetailContent } from "./_components/news-detail-content";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

/** ISR refresh for article pages (mirrors the news list cadence). */
export const revalidate = 300;

/**
 * Prerender every published article so the URLs listed in sitemap.xml
 * resolve to real static pages on first crawl.
 */
export async function generateStaticParams() {
  try {
    const [eventsRes, linkedinRes] = await Promise.all([
      newsServerService.getEvents({ current: 1, size: 100 }),
      newsServerService.getLinkedin({ current: 1, size: 100 }),
    ]);
    const ids = new Set<string>();
    for (const res of [eventsRes, linkedinRes]) {
      if (res.code !== BUSINESS_CODE.SUCCESS) continue;
      for (const item of res.data?.records ?? []) {
        if (item.id != null) ids.add(String(item.id));
      }
    }
    return routing.locales.flatMap((locale) =>
      [...ids].map((id) => ({ locale, id })),
    );
  } catch {
    return [];
  }
}

/**
 * News detail page — migrated from the legacy Vue `views/newsDetail/index.vue`.
 *
 * Data strategy (mirrors the legacy load flow):
 *  1. Fetch the article detail via the news detail BFF.
 *  2. Fallback: search the events + linkedin lists for the id (legacy store
 *     fallback).
 *  3. Not found anywhere → redirect to the news list.
 */

async function loadArticle(id: string): Promise<NewsItem | null> {
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
    return all.find((a) => String(a.id) === String(id)) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale) ? locale : routing.defaultLocale;
  const article = await loadArticle(id);
  return buildPageMetadata(validLocale, "news", {
    title: article?.title ? `${article.title} — Remi` : undefined,
    description: article?.summary || undefined,
    path: `/news/${id}`,
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
    redirect(`/${validLocale}/news`);
  }

  // NewsArticle structured data — lets Google treat each article as standalone
  // indexable content (headline / date / publisher).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary ?? "",
    datePublished: (article.publishTime as string) ?? (article.date as string) ?? undefined,
    author: { "@type": "Organization", name: "Remi" },
    publisher: { "@type": "Organization", name: "Remi", url: "https://www.remitech.ai" },
  };

  return (
    <div className="min-h-screen bg-[#f2efec] text-[#2c2520]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NewsDetailContent article={article} />
    </div>
  );
}
