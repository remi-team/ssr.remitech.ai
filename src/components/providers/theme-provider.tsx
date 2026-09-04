"use client";

import * as React from "react";

/**
 * Lightweight theme provider — replaces next-themes to eliminate the
 * <script> tag that next-themes injects for FOUC prevention.
 *
 * That <script> tag triggers two React 19 / Next.js 16 errors:
 *  1. "Encountered a script tag while rendering React component."
 *  2. Hydration mismatch (the browser-side script modifies the DOM before
 *     React hydrates, causing a server/client HTML diff).
 *
 * This site is light-only for launch (forcedTheme="light", ThemeToggle
 * disabled in SiteHeader), so the theme is always "light" — no FOUC
 * prevention script is needed.
 *
 * The `useTheme` hook is API-compatible with next-themes so that existing
 * consumers (sonner.tsx, theme-toggle.tsx) work without changes.
 */

interface ThemeContextValue {
  theme: string | undefined;
  resolvedTheme: string | undefined;
  setTheme: (theme: string) => void;
}

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: "light",
  resolvedTheme: "light",
  setTheme: () => {},
});

export function ThemeProvider({
  children,
  forcedTheme,
}: {
  children: React.ReactNode;
  forcedTheme?: string;
  /** Accept-and-ignore extra props from callers still passing next-themes config. */
  [key: string]: unknown;
}) {
  const theme = forcedTheme ?? "light";
  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme: theme,
      setTheme: () => {},
    }),
    [theme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return React.useContext(ThemeContext);
}
