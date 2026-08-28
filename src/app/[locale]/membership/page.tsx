import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing, AVAILABLE_LOCALES } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import { MembershipContent } from "./_components/membership-content";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Membership page — migrated from legacy Vue `membership/index.vue`.
 *
 * Sections (via MembershipContent):
 *  hero → why-remi → membership-categories → benefits → governance → how-to-join → cta
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale) ? locale : routing.defaultLocale;
  return buildPageMetadata(validLocale, "membership");
}

export default async function MembershipPage({ params }: Props) {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  return <MembershipContent />;
}
