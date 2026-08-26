import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing, AVAILABLE_LOCALES } from "@/i18n/routing";
import ComplianceContent from "./_components/compliance-content";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Compliance page — regulatory framework, licences, and trust showcase.
 *
 * Sections (to be migrated from the homepage `/#compliance` anchor):
 *  1. ComplianceHero — page header
 *  2. Trust & Compliance cards
 *  3. Regulatory framework / licences
 *
 * TODO: Migrate section components from `@/app/[locale]/_components/`
 *       (trust-compliance.tsx, etc.).
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale) ? locale : routing.defaultLocale;
  const title =
    validLocale === "zh" ? "合规与监管 — Remi" : "Compliance — Remi";
  const description =
    validLocale === "zh"
      ? "Remi 的合规框架、监管牌照与信托架构 — 以监管合规为默认能力。"
      : "Remi's regulatory framework, licences and trust architecture — compliance as a default capability.";
  return { title, description };
}

export default async function CompliancePage({ params }: Props) {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  return (
    <>
      <ComplianceContent />
    </>
  );
}
