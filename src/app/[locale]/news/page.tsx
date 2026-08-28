import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing, AVAILABLE_LOCALES } from "@/i18n/routing";
import { BUSINESS_CODE } from "@/lib/api/config";
import type { NewsItem } from "@/lib/api/types";
import { newsServerService } from "@/services/server/news-server-service";
import { buildPageMetadata } from "@/lib/seo";
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

/** Refresh the server-rendered news list every 5 minutes (ISR). */
export const revalidate = 300;

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
    <div className="min-h-screen bg-[#f2efec] text-[#2c2520]">
      <NewsHero />
      <NewsGrid initialEvents={events} initialLinkedin={linkedin} />
      <NewsCta />
    </div>
  );
}
