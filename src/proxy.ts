import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "@/i18n/routing";

/**
 * next-intl middleware: handles locale negotiation, prefixing and redirects.
 * The matcher excludes API routes, Next internals and static files.
 */
const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  // Legacy news URLs (/news-detail?id=123, /zh/news-detail?id=123) are
  // redirected before locale negotiation. next-intl rewrites unprefixed
  // paths to /en/*, which would bypass a root-level page — handling the
  // mapping here guarantees a clean 308 regardless of prefix.
  const { pathname } = request.nextUrl;
  const legacyMatch = pathname.match(/^(\/(en|zh))?\/news-detail$/);
  if (legacyMatch) {
    const prefix = legacyMatch[1] === "/zh" ? "/zh" : "";
    const id = request.nextUrl.searchParams.get("id");
    const target = id
      ? `${prefix}/news/${encodeURIComponent(id)}`
      : `${prefix}/news`;
    return NextResponse.redirect(new URL(target, request.url), 308);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
