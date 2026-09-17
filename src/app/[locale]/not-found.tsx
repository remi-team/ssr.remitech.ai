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
 * Copy used when the i18n layer itself is unavailable. Kept in sync with the
 * `NotFound` namespace of `/messages/*.json`.
 */
const FALLBACK_COPY: Record<string, string> = {
  title: "Page not found",
  description: "The page you're looking for may have been moved or removed.",
  back: "Back to home",
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
 * `not-found` boundaries receive no `params`, so the translator is resolved
 * from the request context; when there is none (global 404, or a boundary
 * rendered outside the `[locale]` provider) we degrade to `FALLBACK_COPY`.
 *
 * The degradation has to survive *both* steps, not just `getTranslations()`:
 * the previous shape assigned the fallback **object** to `t` and then called
 * `t("title")`, so a single missing `NotFound` key — or any request-context
 * loss — crashed the boundary with "t is not a function" and turned a
 * legitimate 404 into a 500 (2026-09-16 re-test, 上线前必须修-1). Wrapping each
 * lookup in its own guard keeps the dead-end page a dead-end page.
 */
export default async function NotFound() {
  const fallback = (key: string) => FALLBACK_COPY[key] ?? key;
  let t: (key: string) => string = fallback;
  try {
    const translate = await getTranslations("NotFound");
    t = (key: string) => {
      try {
        return translate(key);
      } catch {
        return fallback(key);
      }
    };
  } catch {
    // No intl context available — `fallback` stays in effect.
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
