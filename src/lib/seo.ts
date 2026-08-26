import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { siteConfig } from "@/config/site";

/**
 * Centralized SEO metadata factory.
 *
 * Per-locale title/description come from message catalogues (Single Source of
 * Truth). `metadataBase` resolves relative OG/Twitter image URLs absolutely.
 * `alternates` emits correct hreflang entries for international SEO.
 */
export async function buildMetadata(
  locale: string,
  path = "/"
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Meta" });

  const title = t("title");
  const description = t("description");
  const keywords = t("keywords");
  const canonical = new URL(path, siteConfig.url);

  // hreflang alternates — include x-default pointing at the default locale.
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    const prefix = l === routing.defaultLocale ? "" : `/${l}`;
    languages[l] = new URL(`${prefix}${path}`, siteConfig.url).toString();
  }
  languages["x-default"] = canonical.toString();

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: t("titleTemplate"),
    },
    description,
    keywords: keywords ? keywords.split(",").map((k) => k.trim()) : undefined,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    applicationName: siteConfig.name,
    alternates: {
      canonical: canonical.toString(),
      languages,
    },
    openGraph: {
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      url: canonical.toString(),
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/icon.svg",
      shortcut: "/icon.svg",
      apple: "/icon.svg",
    },
  };
}
