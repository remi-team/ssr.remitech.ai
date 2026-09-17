import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing, AVAILABLE_LOCALES } from "@/i18n/routing";
import { BUSINESS_CODE } from "@/lib/api/config";
import type { NewsItem } from "@/lib/api/types";
import { newsServerService } from "@/services/server/news-server-service";
import { buildPageMetadata } from "@/lib/seo";
import { PageJsonLd } from "@/components/seo/json-ld";
import { NewsHero } from "./_components/news-hero";
import { NewsGrid } from "./_components/news-grid";
import { NewsCta } from "./_components/news-cta";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * News & Events page — migrated from the legacy Vue `index.vue` (news route).
 *
 * Section order:
 *  1. NewsHero  — banner hero with "News & Events" title + subtitle
 *  2. NewsGrid  — Press Releases (2-col) + Social Media & Events (3-col)
 *  3. NewsCta   — "Want to meet us at an upcoming event?"
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale) ? locale : routing.defaultLocale;
  return buildPageMetadata(validLocale, "news");
}

/**
 * Request-dependent by design — do NOT re-add `revalidate` (ISR).
 *
 * `loadInitialNews()` → `getAccessToken()` awaits `cookies()` on every render.
 * With the previous `revalidate = 300`, the build prerendered an ISR shell and
 * every runtime revalidation hit the same static→dynamic flip as the detail
 * page ("Page changed from static to dynamic at runtime, reason: connection"),
 * freezing the SIT list on the build-time snapshot. Edge freshness is handled
 * by NEWS_CACHE `s-maxage=300` in next.config.ts instead.
 */
export const dynamic = "force-dynamic";

/**
 * Prefetch the news lists server-side so the first HTML response contains the
 * articles (crawlable + instantly visible) instead of an empty shell that
 * fills ~6s later via a client fetch.
 */
async function loadInitialNews(): Promise<{ events: NewsItem[]; linkedin: NewsItem[] }> {
  try {
    const [eventsRes, linkedinRes] = await Promise.all([
      newsServerService.getEvents({ current: 1, size: 20 }),
      newsServerService.getLinkedin({ current: 1, size: 20 }),
    ]);
    return {
      events:
        eventsRes.code === BUSINESS_CODE.SUCCESS ? (eventsRes.data?.records ?? []) : [],
      linkedin:
        linkedinRes.code === BUSINESS_CODE.SUCCESS ? (linkedinRes.data?.records ?? []) : [],
    };
  } catch {
    return { events: [], linkedin: [] };
  }
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  const { events, linkedin } = await loadInitialNews();

  return (
    <>
      <PageJsonLd page="news" />
      <div className="min-h-screen bg-[#f2efec] text-[#2c2520]">
        <NewsHero />
        <NewsGrid initialEvents={events} initialLinkedin={linkedin} />
        <NewsCta />
      </div>
    </>
  );
}
