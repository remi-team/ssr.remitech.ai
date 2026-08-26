"use client";

import { BFF_ROUTES } from "@/lib/api/config";
import type { ApiResponse, NewsItem, PageParams, PageResponse } from "@/lib/api/types";

/**
 * Client-side news service — the "interface abstraction" for news data.
 *
 * Migrated from the legacy Vue `news.js`. Calls the BFF (Next.js Route
 * Handlers under `/api/news/*`), never the upstream directly. The BFF handles
 * ISR caching and upstream proxying.
 */

async function fetchPage<T>(
  path: string,
  params: PageParams,
): Promise<ApiResponse<T>> {
  const sp = new URLSearchParams();
  if (params.current !== undefined) sp.append("current", String(params.current));
  if (params.size !== undefined) sp.append("size", String(params.size));
  const qs = sp.toString();
  const url = qs ? `${path}?${qs}` : path;

  const res = await fetch(url, { Accept: "application/json" });
  if (!res.ok) {
    throw new Error(`News request failed: ${res.status} ${path}`);
  }
  return res.json() as Promise<ApiResponse<T>>;
}

export const newsService = {
  /** Homepage news list (paginated). */
  getHomepage: (params: PageParams = { current: 1, size: 10 }) =>
    fetchPage<PageResponse<NewsItem>>(BFF_ROUTES.NEWS.HOMEPAGE, params),

  /** Events news list (paginated). */
  getEvents: (params: PageParams = { current: 1, size: 10 }) =>
    fetchPage<PageResponse<NewsItem>>(BFF_ROUTES.NEWS.EVENTS, params),

  /** LinkedIn posts list (paginated). */
  getLinkedin: (params: PageParams = { current: 1, size: 10 }) =>
    fetchPage<PageResponse<NewsItem>>(BFF_ROUTES.NEWS.LINKEDIN, params),
};
