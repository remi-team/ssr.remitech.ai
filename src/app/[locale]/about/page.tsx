import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing, AVAILABLE_LOCALES } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
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
  return buildPageMetadata(validLocale, "about");
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
