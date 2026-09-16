import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { buildCsp, createCspNonce } from "@/config/csp";
import { routing } from "@/i18n/routing";

/**
 * Edge middleware: legacy-URL rescue, case normalisation, locale negotiation
 * and the per-request Content-Security-Policy. Runs before the App Router
 * resolves any segment.
 *
 * IMPORTANT — the matcher below excludes every path containing a dot
 * (`.*\\..*`), so `/sitemap.xml.gz`, `/foo.png` and `/icon.svg` never reach
 * this file. Those soft-404s are handled where they actually get resolved: the
 * `[locale]` layout rejects unknown locales with `notFound()`
 * (see `src/app/[locale]/layout.tsx`, QA BUG-05). Because no nonce is minted
 * for them, `next.config.ts` answers those paths with the nonce-less CSP
 * fallback (QA BUG-18).
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

function resolve(request: NextRequest) {
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

/**
 * Staging guard. One image is promoted through every environment and
 * `SITE_ENV` is injected at runtime by the ConfigMap, so this has to be read
 * per request rather than captured at module scope — a build-time snapshot
 * would freeze the value the CI machine happened to have and either leave SIT
 * indexable or, far worse, mark production as `noindex` (same reasoning as
 * `src/app/robots.ts`).
 *
 * Header-level `noindex` is the belt to the `<meta name="robots">` braces: it
 * also covers responses that carry no HTML head at all, which is what keeps a
 * staging domain from leaking into the index.
 */
const isProductionDeployment = () =>
  (process.env.SITE_ENV ?? "sit") === "production";

/**
 * Attach the CSP carrying a nonce that only this request may use (QA BUG-18).
 *
 * Both halves are load-bearing and the order is not optional:
 *  • the **request** header is what Next reads to nonce its own inline flight
 *    scripts (`server/app-render/app-render.js` → `getScriptNonceFromHeader`);
 *    it has to be set before `intlMiddleware` runs, because that call returns
 *    `NextResponse.next({request: {headers}})` built from a clone of
 *    `request.headers` and is what forwards them to the renderer.
 *  • the **response** header is what the browser enforces. Writing only the
 *    request header would leave the policy unset (and vice versa would block
 *    every script Next just nonce'd).
 *
 * Redirects get the header too — they carry no executable body, but keeping
 * one code path means no response can escape the policy by accident.
 */
export default function proxy(request: NextRequest) {
  const policy = buildCsp(createCspNonce());
  request.headers.set("content-security-policy", policy);

  const response = resolve(request);
  response.headers.set("Content-Security-Policy", policy);
  if (!isProductionDeployment()) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
