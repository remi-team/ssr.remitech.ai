import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing, AVAILABLE_LOCALES } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import { PolicyPageLayout } from "../_components/policy-page-layout";
import { cookieIntroEn, cookieSectionsEn } from "./_components/content-en";
import { cookieIntroZh, cookieSectionsZh } from "./_components/content-zh";

type Props = {
  params: Promise<{ locale: string }>;
};

/** Cookie Policy page — migrated from the legacy Vue `cookiePolicy` view. */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale) ? locale : routing.defaultLocale;
  return buildPageMetadata(validLocale, "cookiePolicy");
}

export default async function CookiePolicyPage({ params }: Props) {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  const zh = validLocale === "zh";

  return (
    <PolicyPageLayout
      title={zh ? "Cookie 政策" : "Cookie Policy"}
      updated={zh ? "最后更新：2026 年 6 月" : "Last updated: June 2026"}
      intro={zh ? cookieIntroZh : cookieIntroEn}
      sections={zh ? cookieSectionsZh : cookieSectionsEn}
      ctaTitle={zh ? "对 Cookie 有疑问？" : "Questions about cookies?"}
    />
  );
}
