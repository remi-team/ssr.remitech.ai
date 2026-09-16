import { connection } from "next/server";

/**
 * Global 404 — rendered for ANY unmatched route, including extension paths
 * (`.png`, `.css`, `.js`, `.xml`, `.txt`, `favicon.ico`, …) that bypass the
 * locale middleware. Prevents the historical "soft 404" where missing files
 * returned the home page HTML with HTTP 200.
 *
 * Deliberately renders its own `<head>` and exports **no** `metadata`: this
 * route has no root layout, so React's metadata hoisting writes a second set of
 * tags on top of the manual ones — the 2026-09-15 re-test found two
 * `<meta name="robots">` on every file 404. One source of truth, the JSX.
 */
export const dynamic = "force-dynamic";

export default async function NotFound() {
  // `force-dynamic` alone is ignored for this route: it is served as the
  // `/_not-found` fallback and Next still folds it into the Full Route Cache,
  // which is where `/missing.css` and `/sitemap.xml.gz` picked up
  // `s-maxage=31536000` — a dead file being un-reachable from the CDN for a
  // year (2026-09-15 re-test, 技术SEO-4). Touching a dynamic API opts the
  // render out of that cache for real, so the response reverts to Next's
  // dynamic default (`private, no-cache, no-store`).
  await connection();

  return (
    <html lang="en">
      {/* This route renders its own document (no root layout), so React's
          metadata hoisting has no <head> to write into — the 404 therefore
          shipped without a <title> (QA BUG-16). Declaring <head> explicitly
          keeps the page valid even when metadata is skipped. */}
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Page not found — Remi</title>
        <meta
          name="description"
          content="The page or file you are looking for on remitech.ai does not exist."
        />
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f2efec", color: "#2c2520" }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "24px",
          }}
        >
          <p style={{ fontSize: 14, letterSpacing: "0.2em", color: "#FF6900", margin: 0 }}>
            ERROR 404
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 300, margin: "12px 0" }}>
            Page not found
          </h1>
          <p style={{ color: "#6B7280", margin: "0 0 24px" }}>
            The page or file you are looking for does not exist.
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "10px 28px",
              background: "#FF6900",
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            Back to Home
          </a>
        </main>
      </body>
    </html>
  );
}
