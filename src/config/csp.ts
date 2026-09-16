/**
 * Content-Security-Policy — single source of truth (QA BUG-18).
 *
 * Read from two places, which is why it does not live in `next.config.ts`:
 *  • `src/proxy.ts` renders it **with a per-request nonce** for every path the
 *    middleware matcher covers — i.e. every document the site actually serves.
 *  • `next.config.ts` renders it **without** a nonce as the fallback for the
 *    paths middleware deliberately skips: dotted URLs (`/missing.css`,
 *    `/sitemap.xml.gz`, …). Those still answer with a React 404 *document*
 *    holding Next's own inline flight scripts, and nothing ran to mint a nonce
 *    for them, so the fallback keeps `'unsafe-inline'`. Every real page gets
 *    the strict, nonce-only policy instead.
 *
 * Why `script-src` can lose `'unsafe-inline'` at all: the only CSP-governed
 * inline scripts in the output are Next's `self.__next_f.push(...)` flight
 * chunks, and Next 16 nonce's them automatically as soon as the **request**
 * carries a `Content-Security-Policy` header containing `'nonce-…'`
 * (`server/app-render/app-render.js` → `getScriptNonceFromHeader`). The JSON-LD
 * blocks of `src/components/seo/json-ld.tsx` never stood in the way —
 * `<script type="application/ld+json">` is a data block that the browser does
 * not execute, so `script-src` does not apply to it. (The comment this
 * replaces claimed the opposite; the previous disposition was wrong.)
 *
 * `style-src` keeps `'unsafe-inline'` on purpose: the homepage alone sets ~30
 * `style=` attributes (CSS custom properties, one-off offsets), and CSP hashes
 * are per-value, so there is nothing stable to pin. Inline styles do not carry
 * the script-injection risk that `'unsafe-inline'` in `script-src` does.
 *
 * Caveat for future edits: no page is statically prerendered today (see
 * `.next/prerender-manifest.json`). Should a route ever become fully static,
 * its HTML is written at build time when no per-request nonce exists, and Next
 * does not rewrite nonces inside the prerender cache — that route would ship
 * un-nonceable inline scripts and fail to hydrate under this policy.
 */
const isDev = process.env.NODE_ENV !== "production";

/**
 * `nonce-<base64>` as Next parses it:
 * `/^'nonce-([A-Za-z0-9+/_-]+={0,2})'$/`, so the value must be plain base64
 * (padding allowed) and the whole source expression stays single-quoted.
 */
export function createCspNonce(): string {
  // `btoa` + `crypto.randomUUID` are available in both the Node and the edge
  // runtime the middleware may run under.
  return btoa(crypto.randomUUID());
}

export function buildCsp(nonce?: string): string {
  return [
    "default-src 'self'",
    [
      "script-src 'self'",
      // Documents get a nonce; the middleware-less fallback above keeps the
      // legacy allowance. Browsers ignore `'unsafe-inline'` once a nonce is
      // present, so the two are never equally authoritative.
      nonce ? `'nonce-${nonce}'` : "'unsafe-inline'",
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
  ].join("; ");
}
