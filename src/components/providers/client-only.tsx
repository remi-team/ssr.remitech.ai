"use client";

import * as React from "react";

/**
 * Renders children only after client-side mount.
 *
 * Why this exists: client-side data hooks (React Query `useSuspenseQuery`)
 * would otherwise execute their queryFn during SSR, where relative BFF URLs
 * are invalid. By gating on mount, we guarantee the query only runs in the
 * browser — the Suspense fallback streams during SSR instead.
 *
 * This is the idiomatic pattern for below-the-fold, non-SEO-critical content
 * that should hydrate progressively.
 */
export function ClientOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return <>{fallback}</>;
  return <>{children}</>;
}
