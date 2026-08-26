import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing, AVAILABLE_LOCALES } from "@/i18n/routing";
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
  const title = validLocale === "zh" ? "Cookie 政策 — Remi" : "Cookie Policy — Remi";
  const description =
    validLocale === "zh"
      ? "了解 Remi 网站如何使用 Cookie 及类似技术，以及如何管理您的 Cookie 偏好。"
      : "Learn how the Remi website uses cookies and similar technologies, and how you can manage your cookie preferences.";
  return { title, description };
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
