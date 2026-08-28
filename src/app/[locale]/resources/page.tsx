import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";

import { routing, AVAILABLE_LOCALES } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import ResourcesContent from "./_components/resources-content";
import { qaItems } from "./faq-data";

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
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale) ? locale : routing.defaultLocale;
  return buildPageMetadata(validLocale, "resources");
}

export default async function ResourcesPage({ params }: Props) {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  return (
    <>
      {/* FAQPage structured data — mirrors the visible FAQ accordion. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: qaItems.map((qa) => ({
              "@type": "Question",
              name: qa.title,
              acceptedAnswer: {
                "@type": "Answer",
                text: qa.content.map((s) => s.trim()).join(" "),
              },
            })),
          }),
        }}
      />
      <ResourcesContent />
    </>
  );
}
