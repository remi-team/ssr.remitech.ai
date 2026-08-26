import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing } from "@/i18n/routing";
import { Cta } from "@/components/cta";
import { ChequeHero } from "./_components/cheque-hero";
import { ChequeContent } from "./_components/cheque-content";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * E-Cheque solution page — migrated from the legacy Vue `ECheque.vue`.
 *
 * Section order:
 *  1. ChequeHero   — full-bleed dark hero with responsive `<picture>` background
 *  2. ChequeContent — Description (highlight box) → Features (2-col grid) → Use Cases (card grid)
 *  3. CTA banner    — quote + call to action
 *
 * SEO: server-rendered metadata with zh/en variants.
 * Performance: static data inlined; GSAP replaced with IntersectionObserver reveal.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const title =
    validLocale === "zh" ? "电子支票 — Remi" : "E-Cheque — Remi";
  const description =
    validLocale === "zh"
      ? "将传统支票转化为数字化、可追踪且合规的支付工具。赋能合同支付、薪资清算与贸易融资。"
      : "Transform traditional checks into digital, trackable and compliant payment instruments for contract payments, payroll, and trade finance.";
  return { title, description };
}

export default async function ChequePage({ params }: Props) {
  const { locale } = await params;
  const validLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  return (
    <div className="min-h-screen bg-[#FAF8F7]">
      <ChequeHero />
      <ChequeContent />
      <Cta>
        <h2 className="mx-auto mb-[36px] max-w-[860px] text-[24px] leading-[1.3] text-white md:text-[28px] lg:text-[32px]">
          &ldquo;The balance sheet ceiling is structural. The way through it
          has always been fees — and fees build the relationships that build
          reputations that open corridors.&rdquo;
        </h2>
      </Cta>
    </div>
  );
}
