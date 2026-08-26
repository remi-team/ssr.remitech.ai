import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing } from "@/i18n/routing";
import { RegtechContent } from "./_components/regtech-content";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * RegTech solution page.
 *
 * Sections migrated from the original Vue Regtech.vue:
 *  1. RegtechHero — dark banner with title + description
 *  2. RegtechContent — all feature sections (compliance, KYC, AML,
 *     regulatory intervention, dashboard, FATF, financial market,
 *     integration, global alignment)
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const title =
    validLocale === "zh" ? "合规科技 — Remi" : "RegTech — Remi";
  const description =
    validLocale === "zh"
      ? "将可编程的合规、监控与报告嵌入每一笔受监管的交易旅程。"
      : "Embed programmable compliance, monitoring and reporting into every regulated transaction journey.";
  return { title, description };
}

export default async function RegtechPage({ params }: Props) {
  const { locale } = await params;
  const validLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  return (
    <div className="min-h-screen bg-[#f2efec] text-[#2c2520]">
      <RegtechContent />
    </div>
  );
}
