import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing } from "@/i18n/routing";
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
  const validLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const title =
    validLocale === "zh" ? "会员 — Remi" : "Membership — Remi";
  const description =
    validLocale === "zh"
      ? "加入 Remi 会员体系，获取受监管的数字金融基础设施与服务。"
      : "Join the Remi membership program and access regulated digital financial infrastructure and services.";
  return { title, description };
}

export default async function MembershipPage({ params }: Props) {
  const { locale } = await params;
  const validLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  return <MembershipContent />;
}
