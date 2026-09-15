import * as React from "react";
import { Link } from "@/i18n/navigation";

/**
 * AppLink — the single entry point for in-app navigation.
 *
 * QA BUG-06: the header mega-menu, mobile drawer, footer, hero CTA and the
 * shared `<Cta>` band were all bare `<a href>`, so every click threw away the
 * React tree and re-ran SSR + hydration (no prefetch, lost scroll/state).
 * Anything resolving to a locale-relative route now goes through next-intl's
 * `<Link>`, which keeps routing on the client.
 *
 * The component is side-effect free (no `"use client"`, no hooks) so it can be
 * imported from both Server and Client Components; `ref` rides along as a
 * regular React 19 prop.
 */

/** Hash / protocol / protocol-relative hrefs must stay native anchors. */
const NON_ROUTABLE_HREF = /^\s*(?:[a-z][a-z0-9+.-]*:|\/\/|#)|#/i;

/** True when `href` can be handled by the client router. */
export function isRoutableHref(href: string): boolean {
  return (
    typeof href === "string" && href.length > 0 && !NON_ROUTABLE_HREF.test(href)
  );
}

export type AppLinkProps = Omit<React.ComponentProps<"a">, "href"> & {
  href: string;
};

export function AppLink({ href, ...props }: AppLinkProps) {
  if (!isRoutableHref(href)) {
    return <a href={href} {...props} />;
  }
  return <Link href={href} {...props} />;
}
