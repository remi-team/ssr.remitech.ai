import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing, AVAILABLE_LOCALES } from "@/i18n/routing";
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
  const title =
    validLocale === "zh" ? "跨境支付 — Remi" : "Cross-Border Payment — Remi";
  const description =
    validLocale === "zh"
      ? "Remi 银行间跨境清算与结算系统，为全球受监管机构之间高效、安全、合规且低成本的 P2P 交易网络。"
      : "Remi Inter-bank Cross-border Clearing and Settlement System creates an efficient, secure, highly compliant, and cost-effective network for peer-to-peer transactions among regulated institutions globally.";
  return { title, description };
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
