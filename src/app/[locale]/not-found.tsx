import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const NOT_FOUND_TITLE = "Page not found — Remi";
const NOT_FOUND_DESCRIPTION =
  "The page you are looking for on remitech.ai does not exist or has moved.";

/**
 * Locale-scoped 404 metadata.
 *
 * The 404 used to inherit `[locale]/layout`'s `buildMetadata()`, which is the
 * **home page's** identity — so every in-locale miss (`/news/999999`, a removed
 * page) shipped the homepage title, homepage description and
 * `<link rel="canonical" href="/">`. A canonical pointing at the homepage tells
 * crawlers the missing URL is a duplicate of `/` rather than a dead end
 * (2026-09-15 re-test, 技术SEO-4).
 *
 * `alternates.canonical: undefined` clears the inherited value, and every
 * `openGraph`/`twitter` field has to be **re-declared**: Next merges those two
 * objects per key, so a child that omits them keeps the home `og:title`,
 * `og:description` and `og:url` verbatim.
 *
 * `robots` stays explicit (a production deploy must still not index a 404).
 * It renders alongside the single `<meta name="robots" content="noindex">` that
 * Next's own not-found boundary always injects — that one is framework
 * behaviour with no opt-out, and both values agree.
 */
export const metadata: Metadata = {
  title: NOT_FOUND_TITLE,
  description: NOT_FOUND_DESCRIPTION,
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
  openGraph: {
    type: "website",
    url: undefined,
    siteName: siteConfig.name,
    title: NOT_FOUND_TITLE,
    description: NOT_FOUND_DESCRIPTION,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: NOT_FOUND_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: NOT_FOUND_TITLE,
    description: NOT_FOUND_DESCRIPTION,
    images: [siteConfig.ogImage],
  },
};

/**
 * A miss must never be cached: without this the 404 inherited the document
 * cache-control of whatever route pattern it was rendered under (a dead
 * `/news/{id}` was served from the edge for an hour), and a removed page kept
 * resolving for its stale readers (2026-09-15 re-test, 技术SEO-4).
 */
export const dynamic = "force-dynamic";

/**
 * Locale-scoped 404 page.
 *
 * `params` may be undefined when this page is rendered outside a locale
 * segment, so we resolve the translator from the request context instead.
 * This keeps the page defensive without sacrificing i18n.
 */
export default async function NotFound() {
  let t;
  try {
    t = await getTranslations("NotFound");
  } catch {
    // Fallback when no intl context is available (e.g. global 404).
    t = {
      title: "Page not found",
      description: "The page you're looking for may have been moved or removed.",
      back: "Back to home",
    } as const;
  }

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-7xl font-bold text-emerald-600 dark:text-emerald-400">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold">{t("title")}</h1>
      <p className="mt-2 max-w-md text-muted-foreground">{t("description")}</p>
      <Button asChild className="mt-8">
        <Link href="/#top">{t("back")}</Link>
      </Button>
    </div>
  );
}
