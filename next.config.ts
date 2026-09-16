import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { buildCsp } from "./src/config/csp";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Security response headers applied to every response.
 *
 * The CSP is built in `src/config/csp.ts` and this file only carries its
 * nonce-less fallback (see there for the full QA BUG-18 rationale): every
 * document that passes through `src/proxy.ts` gets a per-request nonce and no
 * `'unsafe-inline'` at all, while dotted paths — which the middleware matcher
 * deliberately skips, yet still answer with a React 404 document containing
 * Next's inline flight scripts — keep the legacy allowance so they hydrate.
 * Everything else (news article HTML, JSON-LD, gtag) stayed allow-listed as
 * before, which is what removed the CSP console errors the QA pass recorded.
 *
 * Production keeps the strict policy (React never uses eval() there).
 */
const cspFallback = {
  key: "Content-Security-Policy",
  value: buildCsp(),
};

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/**
 * HTML caching (QA BUG-09).
 *
 * Prerendered pages used to ship `s-maxage=31536000` with no
 * `stale-while-revalidate`, so a CDN edge could serve a month-old (up to
 * year-old) page with no mechanism to refresh it. `max-age=0` keeps browsers
 * honest, a short `s-maxage` bounds staleness, and a long `swr` window keeps
 * the origin load of the old 1-year TTL: the first request after expiry serves
 * the stale copy and revalidates in the background.
 */
const STATIC_HTML_CACHE =
  "public, max-age=0, s-maxage=3600, stale-while-revalidate=604800";
/** Article list + detail revalidate every 5 minutes (see `revalidate = 300`). */
const NEWS_CACHE =
  "public, max-age=0, s-maxage=300, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Legacy route → SSR route (301 — permanent, preserves link equity).
      // Source list mirrors `upload/old.remitech.ai/src/router/index.js`.
      // About/Contact keep the legacy names (/aboutUs, /contactUs) as the
      // canonical SSR routes; the short forms redirect to them.
      { source: "/about", destination: "/aboutUs", permanent: true },
      { source: "/about-us", destination: "/aboutUs", permanent: true },
      { source: "/contact", destination: "/contactUs", permanent: true },
      { source: "/solution", destination: "/solutions", permanent: true },
      // The legacy Vue router uses the hyphenated spelling; the previous
      // migration note only covered the `Crossborder` typo variant, leaving
      // `/solution-Cross-border-payment` a 404 (QA BUG-08).
      {
        source: "/solution-Cross-border-payment",
        destination: "/solutions/cross-border-payment",
        permanent: true,
      },
      {
        source: "/solution-Crossborder-payment",
        destination: "/solutions/cross-border-payment",
        permanent: true,
      },
      { source: "/fx", destination: "/solutions/fx", permanent: true },
      { source: "/stablecoin-Issuance", destination: "/solutions/stablecoin", permanent: true },
      { source: "/regtech", destination: "/solutions/regtech", permanent: true },
      { source: "/e-cheque", destination: "/solutions/cheque", permanent: true },
      { source: "/lc", destination: "/solutions/lc", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // CSP fallback, scoped to the responses `src/proxy.ts` never sees. A
      // blanket `/(.*)` rule here would clobber the nonce-bearing CSP that the
      // middleware sets on its own responses (`headers()` in this file wins
      // over middleware-set headers); the renderer would then emit nonced
      // scripts against a policy listing no nonce, and no page would hydrate.
      {
        source: "/((?!api|_next).*\\..*)",
        headers: [cspFallback],
      },
      {
        source: "/api/:path*",
        headers: [cspFallback],
      },
      {
        // Everything else that is a document (API routes, `_next` and every
        // path carrying a dot excluded — the latter are `public/` assets and
        // the generated `/sitemap.xml` + `/robots.txt`, which set their own
        // headers and must not inherit a 1-hour edge TTL).
        source: "/((?!api|_next|.*\\..*).*)",
        headers: [{ key: "Cache-Control", value: STATIC_HTML_CACHE }],
      },
      // News list + articles revalidate every 5 minutes, so their rule is
      // declared AFTER the blanket one: when several `source`s match, later
      // wins per key (verified 2026-09-15 — `/en/news/403` shipped
      // `s-maxage=300` while also matching the document rule above).
      //
      // One rule per prefix, NOT `/((?:en|zh)/)?news/:path*`: path-to-regexp
      // compiles the optional group's trailing `/` into the group, leaving
      // `news` without its leading slash, so the regex could never match an
      // unprefixed path — `/news/403` silently kept the 1-hour default and the
      // 5-minute news cadence never shipped (2026-09-15 re-test, 技术SEO-4).
      {
        source: "/news/:path*",
        headers: [{ key: "Cache-Control", value: NEWS_CACHE }],
      },
      {
        source: "/en/news/:path*",
        headers: [{ key: "Cache-Control", value: NEWS_CACHE }],
      },
      {
        source: "/zh/news/:path*",
        headers: [{ key: "Cache-Control", value: NEWS_CACHE }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
