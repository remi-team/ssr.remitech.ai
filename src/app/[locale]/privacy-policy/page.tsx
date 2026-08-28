import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing, AVAILABLE_LOCALES } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import { PolicyPageLayout } from "../_components/policy-page-layout";
import { privacyIntroEn, privacySectionsEn } from "./_components/content-en";
import { privacyIntroZh, privacySectionsZh } from "./_components/content-zh";

type Props = {
  params: Promise<{ locale: string }>;
};

/** Privacy Policy page — migrated from the legacy Vue `privacyPolicy` view. */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale) ? locale : routing.defaultLocale;
  return buildPageMetadata(validLocale, "privacyPolicy");
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  const zh = validLocale === "zh";

  return (
    <PolicyPageLayout
      title={zh ? "隐私政策" : "Privacy Policy"}
      updated={zh ? "最后更新：2026 年 6 月" : "Last updated: June 2026"}
      intro={zh ? privacyIntroZh : privacyIntroEn}
      sections={zh ? privacySectionsZh : privacySectionsEn}
      ctaTitle={zh ? "对您的隐私有疑问？" : "Questions about your privacy?"}
    />
  );
}
