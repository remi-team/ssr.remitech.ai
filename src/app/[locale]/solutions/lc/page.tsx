import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing } from "@/i18n/routing";
import { Cta } from "@/components/cta";
import { LcHero } from "./_components/lc-hero";
import { LcContent } from "./_components/lc-content";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Tokenized Letter of Credit solution page — migrated from legacy Vue `LC.vue`.
 *
 * Sections:
 *  1. LcHero   — full-bleed dark hero
 *  2. LcContent — Market Opportunity → Key Features → Risk Visibility → RWA Marketplace
 *  3. CTA      — quote + call to action
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const title =
    validLocale === "zh" ? "代币化信用证 — Remi" : "Tokenized Letter of Credit — Remi";
  const description =
    validLocale === "zh"
      ? "智能合约信用证在共享许可链上运行。四方同时查看同一状态，修订自动触发，抵押品实时调整。"
      : "Smart contract LC on a shared permissioned chain. All four parties see the same state simultaneously. Amendment triggers automatically. Collateral adjusts in real time.";
  return { title, description };
}

export default async function LcPage({ params }: Props) {
  const { locale } = await params;
  const validLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  return (
    <div className="min-h-screen bg-[#FAF8F7]">
      <LcHero />
      <LcContent />
      <Cta>
        <h2 className="mx-auto mb-[36px] max-w-[860px] text-[24px] leading-[1.3] text-white md:text-[28px] lg:text-[32px]">
          &ldquo;A corporate that has priced risk in real time will not go
          back to a bank that prices it on Tuesday morning with a
          spreadsheet.&rdquo;
        </h2>
      </Cta>
    </div>
  );
}
