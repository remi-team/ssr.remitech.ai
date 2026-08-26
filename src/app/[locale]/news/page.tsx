import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing } from "@/i18n/routing";
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
  const validLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const title = validLocale === "zh" ? "新闻与活动 — Remi" : "News & Events — Remi";
  const description =
    validLocale === "zh"
      ? "新闻稿、行业洞察与全球活动。跟随我们构建受监管的数字金融清算基础设施的旅程。"
      : "Press releases, industry insights, and global events. Follow our journey as we build the regulated clearing infrastructure for digital finance.";
  return { title, description };
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  const validLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  return (
    <div className="min-h-screen bg-[#f2efec] text-[#2c2520]">
      <NewsHero />
      <NewsGrid />
      <NewsCta />
    </div>
  );
}
