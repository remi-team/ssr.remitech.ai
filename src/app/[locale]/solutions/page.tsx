import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing, AVAILABLE_LOCALES } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { SolutionsHero } from "./_components/solutions-hero";
import { SolutionsContent } from "./_components/solutions-content";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Solutions index — mirrors the legacy Vue `/solution` overview page
 * ("7*24 Instant Stablecoin Exchange Platform" hero + metrics + solution grid).
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale)
    ? locale
    : routing.defaultLocale;
  const title =
    validLocale === "zh" ? "解决方案 — Remi" : "Solutions — Remi";
  const description =
    validLocale === "zh"
      ? "从跨境清算到代币化贸易融资，Remi 将结算、合规与国库编织进每一条受监管的交易链路。"
      : "From cross-border clearing to tokenized trade finance, Remi weaves settlement, compliance and treasury into every regulated transaction journey.";
  return { title, description };
}

export default async function SolutionsPage({ params }: Props) {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  return (
    <div className="min-h-screen bg-[#f2efec] text-[#2c2520]">
      <SolutionsHero />
      <SolutionsContent />
    </div>
  );
}
