import type { Metadata } from "next";

/**
 * Global 404 — rendered for ANY unmatched route, including extension paths
 * (`.png`, `.css`, `.js`, `.xml`, `.txt`, `favicon.ico`, …) that bypass the
 * locale middleware. Prevents the historical "soft 404" where missing files
 * returned the home page HTML with HTTP 200.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <html lang="en">
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
