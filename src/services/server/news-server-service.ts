import "server-only";

import { WEBSITE_API_ENDPOINTS } from "@/lib/api/config";
import { websiteApiClient } from "@/lib/api/website-api-client";
import type { ApiResponse, NewsItem, PageParams, PageResponse } from "@/lib/api/types";

/**
 * Server-side news service — calls the website API service (content module).
 */

/** Fetch a paginated news list from a given website API endpoint. */
async function fetchPage(
  endpoint: string,
  params: PageParams,
): Promise<ApiResponse<PageResponse<NewsItem>>> {
  return websiteApiClient.get<PageResponse<NewsItem>>(endpoint, {
    params: { current: params.current, size: params.size },
  });
}

export const newsServerService = {
  /** Homepage news list (featured press). */
  getHomepage: (params: PageParams) => fetchPage(WEBSITE_API_ENDPOINTS.CONTENT.NEWS_HOMEPAGE, params),

  /** Events list (press releases for the news page). */
  getEvents: (params: PageParams) => fetchPage(WEBSITE_API_ENDPOINTS.CONTENT.NEWS_EVENTS, params),

  /** LinkedIn posts list. */
  getLinkedin: (params: PageParams) => fetchPage(WEBSITE_API_ENDPOINTS.CONTENT.LINKEDIN, params),

  /** Single article detail (news detail page). */
  getDetail: (id: string): Promise<ApiResponse<NewsItem>> => {
    return websiteApiClient.get<NewsItem>(WEBSITE_API_ENDPOINTS.CONTENT.NEWS_DETAIL(id));
  },
};
