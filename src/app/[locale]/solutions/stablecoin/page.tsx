import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing, AVAILABLE_LOCALES } from "@/i18n/routing";
import { Cta } from "@/components/cta";
import { StablecoinHero } from "./_components/stablecoin-hero";
import { StablecoinContent } from "./_components/stablecoin-content";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Stablecoin Issuance solution page — migrated from legacy Vue `StableCoin.vue`.
 *
 * Sections:
 *  1. StablecoinHero   — full-bleed dark hero
 *  2. StablecoinContent — Bison Bank → Issuance Process → Key Features → Roadmap
 *  3. CTA               — quote + call to action
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale) ? locale : routing.defaultLocale;
  const title =
    validLocale === "zh" ? "稳定币发行 — Remi" : "Stablecoin Issuance — Remi";
  const description =
    validLocale === "zh"
      ? "银行级合规稳定币管理。在MiCA授权下进行发行、转账与赎回，具备完全的储备透明度。由Bison Bank（里斯本）发行。"
      : "Bank-grade compliant stablecoin management. Issuance, transfer, and redemption — under MiCA authorization, with full reserve transparency. Issued by Bison Bank (Lisbon).";
  return { title, description };
}

export default async function StablecoinPage({ params }: Props) {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  return (
    <div className="bg-[#FAF8F7]">
      <StablecoinHero />
      <StablecoinContent />
      <Cta>
        <h2 className="mx-auto mb-[36px] max-w-[860px] text-[24px] leading-[1.3] text-white md:text-[28px] lg:text-[32px]">
          &ldquo;The regulatory moat is not a filing. It is a licensed,
          operating bank with 30 years of institutional history behind every
          transaction.&rdquo;
        </h2>
      </Cta>
    </div>
  );
}
