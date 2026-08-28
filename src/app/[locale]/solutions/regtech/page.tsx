import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing, AVAILABLE_LOCALES } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
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
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale) ? locale : routing.defaultLocale;
  return buildPageMetadata(validLocale, "solutionsRegtech");
}

export default async function RegtechPage({ params }: Props) {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  return (
    <div className="min-h-screen bg-[#f2efec] text-[#2c2520]">
      <RegtechContent />
    </div>
  );
}
