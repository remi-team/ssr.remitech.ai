import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing } from "@/i18n/routing";
import ContactContent from "./_components/contact-content";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const title =
    validLocale === "zh" ? "联系我们 — Remi" : "Contact Us — Remi";
  const description =
    validLocale === "zh"
      ? "联系 Remi 团队 — 获取稳定币基础设施与合规支付网络的专业咨询。"
      : "Get in touch with the Remi team — expert consultation on stablecoin infrastructure and compliance payment networks.";
  return { title, description };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const validLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  return (
    <div className="min-h-screen bg-[#FAF8F7]">
      <ContactContent />
    </div>
  );
}
