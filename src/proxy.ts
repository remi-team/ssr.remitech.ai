import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "@/i18n/routing";

/**
 * Edge middleware: legacy-URL rescue, case normalisation and locale
 * negotiation. Runs before the App Router resolves any segment.
 *
 * IMPORTANT — the matcher below excludes every path containing a dot
 * (`.*\\..*`), so `/sitemap.xml.gz`, `/foo.png` and `/icon.svg` never reach
 * this file. Those soft-404s are handled where they actually get resolved: the
 * `[locale]` layout rejects unknown locales with `notFound()`
 * (see `src/app/[locale]/layout.tsx`, QA BUG-05).
 */

/* ------------------------------------------------------------------ */
/*  Route spellings                                                    */
/* ------------------------------------------------------------------ */

/**
 * Every segment the site serves or redirects, in its canonical casing.
 *
 * Must stay aligned with the route tree under `src/app/[locale]/` and the
 * `redirects()` list in `next.config.ts`. The QA pass found `/News` and
 * `/AboutUs` dead-ending in 404s because App Router segments are
 * case-sensitive while inbound legacy/bookmark links are not (QA BUG-07).
 */
const CANONICAL_SEGMENTS = [
  // Locale prefixes.
  "en",
  "zh",
  // Pages.
  "aboutUs",
  "compliance",
  "contactUs",
  "cookie-policy",
  "membership",
  "news",
  "news-detail",
  "player",
  "privacy-policy",
  "reset-password",
  "resources",
  "solutions",
  // Solutions sub-pages.
  "cheque",
  "cross-border-payment",
  "fx",
  "lc",
  "regtech",
  "stablecoin",
  // Legacy Vue spellings that are still linked from the old index.
  "about",
  "about-us",
  "contact",
  "solution",
  "solution-Cross-border-payment",
  "solution-Crossborder-payment",
  "stablecoin-Issuance",
  "e-cheque",
] as const;

/** lowercase segment → canonical spelling. */
const SEGMENT_CASE = new Map<string, string>(
  CANONICAL_SEGMENTS.map((segment) => [segment.toLowerCase(), segment]),
);

/**
 * Restore the canonical casing of every known segment in `pathname`.
 * Returns `null` when nothing needed changing (the common case — no extra
 * redirect round-trip for correctly-cased URLs).
 */
function normalizeSegmentCase(pathname: string): string | null {
  const parts = pathname.split("/");
  let changed = false;

  const normalized = parts.map((segment) => {
    if (!segment) return segment;
    const canonical = SEGMENT_CASE.get(segment.toLowerCase());
    if (canonical && canonical !== segment) {
      changed = true;
      return canonical;
    }
    return segment;
  });

  return changed ? normalized.join("/") : null;
}

/* ------------------------------------------------------------------ */
/*  Middleware                                                         */
/* ------------------------------------------------------------------ */

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Case normalisation — 301 so crawlers and browsers replace the old
  //    URL in their index instead of keeping the mis-cased duplicate.
  const canonicalPath = normalizeSegmentCase(pathname);
  if (canonicalPath) {
    const target = request.nextUrl.clone();
    target.pathname = canonicalPath;
    return NextResponse.redirect(target, 301);
  }

  // 2. Legacy news URLs (/news-detail?id=123, /zh/news-detail?id=123) are
  //    redirected before locale negotiation. next-intl rewrites unprefixed
  //    paths to /en/*, which would bypass a root-level page — handling the
  //    mapping here guarantees a clean 308 regardless of prefix.
  const legacyMatch = pathname.match(/^(\/(en|zh))?\/news-detail$/);
  if (legacyMatch) {
    const prefix = legacyMatch[1] === "/zh" ? "/zh" : "";
    const id = request.nextUrl.searchParams.get("id");
    const target = id
      ? `${prefix}/news/${encodeURIComponent(id)}`
      : `${prefix}/news`;
    return NextResponse.redirect(new URL(target, request.url), 308);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
