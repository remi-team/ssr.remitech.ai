import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing } from "@/i18n/routing";
import ResourcesContent from "./_components/resources-content";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Resources page — migrated from legacy Vue `resources/index.vue`.
 *
 * Sections (via ResourcesContent):
 *  hero → library → docs → faq
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const title =
    validLocale === "zh" ? "资源中心 — Remi" : "Resources — Remi";
  const description =
    validLocale === "zh"
      ? "浏览 Remi 的白皮书、技术文档、行业报告与教育资料。"
      : "Browse Remi whitepapers, technical documentation, industry reports and educational content.";
  return { title, description };
}

export default async function ResourcesPage({ params }: Props) {
  const { locale } = await params;
  const validLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  return <ResourcesContent />;
}
