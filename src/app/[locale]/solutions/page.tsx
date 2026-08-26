import { redirect } from "next/navigation";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Solutions index — redirects to the primary solution page (Cross-Border Payment).
 *
 * Legacy behaviour: `/solution` showed an overview with a generic CBP hero.
 * The decision was made to land visitors directly on the cross-border-payment
 * page, which is the flagship product.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = hasLocale(routing.locales, locale)
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
  const validLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  // Build the redirect target with locale prefix.
  // zh is the default locale (no prefix); all other locales get prefixed.
  const prefix = validLocale === routing.defaultLocale ? "" : `/${validLocale}`;
  redirect(`${prefix}/solutions/cross-border-payment`);
}
