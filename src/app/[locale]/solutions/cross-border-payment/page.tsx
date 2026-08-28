import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing, AVAILABLE_LOCALES } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import { CbpHero } from "./_components/cbp-hero";
import { CbpContent } from "./_components/cbp-content";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Cross-Border Payment solution page — migrated from the legacy Vue
 * `CrossBorderPayment.vue` (route: /solution-Cross-border-payment).
 *
 * Section order (matches the original):
 *  1. CbpHero            — dark banner hero: "CROSS-BORDER PAYMENT"
 *  2. CbpContent         — Why Banks Choose Remi → Comparison Table →
 *                           How Institutions Use Remi (For Banks / For Fintechs) →
 *                           Exchange Express → CTA
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale) ? locale : routing.defaultLocale;
  return buildPageMetadata(validLocale, "solutionsCrossBorder");
}

export default async function CrossBorderPaymentPage({ params }: Props) {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  return (
    <div className="min-h-screen bg-white">
      <CbpHero />
      <CbpContent />
    </div>
  );
}
