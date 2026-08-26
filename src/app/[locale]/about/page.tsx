import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing, AVAILABLE_LOCALES } from "@/i18n/routing";
import AboutContent from "./_components/about-content";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * About Us page — migrated from legacy Vue `aboutUs/index.vue`.
 *
 * Sections (via AboutContent):
 *  hero → engines (One Group. Three Engines) → vision → cta
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale) ? locale : routing.defaultLocale;
  const title =
    validLocale === "zh" ? "关于我们 — Remi" : "About Us — Remi";
  const description =
    validLocale === "zh"
      ? "Remi 是面向金融机构的受监管稳定币基础设施。了解我们的使命、理念与团队。"
      : "Remi is regulated stablecoin infrastructure built for financial institutions. Learn about our mission, values, and team.";
  return { title, description };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  return (
    <AboutContent />
  );
}
