import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing, AVAILABLE_LOCALES } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import { FxHero } from "./_components/fx-hero";
import { FxContent } from "./_components/fx-content";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * FX & Treasury solution page — migrated from legacy Vue `FX.vue`.
 *
 * Sections:
 *  1. FxHero    — full-bleed dark hero
 *  2. FxContent — metrics → Key Technical Components → Legacy vs REMI → Treasury & Capital Markets → Exchange Express → CTA
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale) ? locale : routing.defaultLocale;
  return buildPageMetadata(validLocale, "solutionsFx");
}

export default async function FxPage({ params }: Props) {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  return (
    <div className="min-h-screen bg-[#f2efec] text-[#2c2520]">
      <FxHero />
      <FxContent />
    </div>
  );
}
