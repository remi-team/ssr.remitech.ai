"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Thin client wrapper around next-themes.
 *
 * The `suppressHydrationWarning` div silences the dev-mode React warning
 * about next-themes injecting a <script> tag for FOUC prevention.
 * In production this script is harmless and the warning does not appear.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <div suppressHydrationWarning>{children}</div>
    </NextThemesProvider>
  );
}
