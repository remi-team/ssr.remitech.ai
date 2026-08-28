import type { ReactNode } from "react";

import "./globals.css";

/**
 * Root layout — intentionally minimal.
 *
 * The real chrome (html/body providers, header/footer) lives in
 * `[locale]/layout.tsx`. This layout exists so that errors outside the locale
 * segment (missing static files, unmatched extension routes) render the
 * global `not-found.tsx` instead of falling back to the home page HTML.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
