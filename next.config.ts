import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Security response headers applied to every response.
 *
 * CSP note — why `'unsafe-inline'` is still here (QA BUG-18, dispositioned):
 *  • `script-src`: the App Router emits inline `self.__next_f.push(...)` RSC
 *    flight scripts, and our JSON-LD blocks are inline `<script>` elements
 *    (they MUST be inline to reach the raw HTML — see `src/components/seo/json-ld.tsx`).
 *    `nextConfig.scriptNonce` covers only Next's own scripts, so removing
 *    `'unsafe-inline'` without nonceing every JSON-LD node breaks hydration.
 *  • `style-src`: Tailwind injects inline CSS variable declarations.
 * What WAS fixed: Google Analytics (gtag.js, loaded only after cookie
 * consent) is allow-listed in `script-src` / `connect-src` / `img-src`, which
 * removes the per-page CSP console error the QA pass recorded.
 *
 * Production keeps the strict policy (React never uses eval() there).
 */
const isDev = process.env.NODE_ENV !== "production";

const cspDirectives = [
  "default-src 'self'",
  [
    "script-src 'self' 'unsafe-inline'",
    // Dev only: React dev mode rebuilds callstacks with eval().
    isDev && "'unsafe-eval'",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
  ]
    .filter(Boolean)
    .join(" "),
  "style-src 'self' 'unsafe-inline'",
  // `https:` covers the S3 bucket that hosts news/LinkedIn cover art.
  "img-src 'self' data: blob: https:",
  // `http:` covers legacy HLS manifests still served over plain HTTP by the
  // resource backend; remove once every media origin is TLS.
  "media-src 'self' blob: https: http:",
  "font-src 'self' data:",
  [
    "connect-src 'self' https:",
    // Turbopack/webpack HMR socket.
    isDev && "ws:",
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
    "https://*.googletagmanager.com",
  ]
    .filter(Boolean)
    .join(" "),
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
];

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: cspDirectives.join("; "),
  },
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
      {
        // News first, so its 5-minute cadence outranks the blanket rule below
        // (header entries are applied in order and the last match wins per key).
        source: "/((?:en|zh)/)?news",
        headers: [{ key: "Cache-Control", value: NEWS_CACHE }],
      },
      {
        source: "/((?:en|zh)/)?news/:path*",
        headers: [{ key: "Cache-Control", value: NEWS_CACHE }],
      },
      {
        // Everything else that is a document (API routes and hashed static
        // assets excluded — the latter already ship immutable headers).
        source: "/((?!api|_next|.*\\..*).*)",
        headers: [{ key: "Cache-Control", value: STATIC_HTML_CACHE }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
