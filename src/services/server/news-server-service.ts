import "server-only";

import { API_ENDPOINTS, BUSINESS_CODE } from "@/lib/api/config";
import { upstreamClient } from "@/lib/api/upstream";
import type { ApiResponse, NewsItem, PageParams, PageResponse } from "@/lib/api/types";

/**
 * Server-side news service — calls the upstream content API.
 *
 * Placeholder mode returns mock news data (aligned with the live remitech.ai
 * homepage + news page) when no upstream is configured, so the UI is fully
 * functional in development / preview.
 */

const USE_PLACEHOLDER = !process.env.UPSTREAM_API_HOST && !process.env.UPSTREAM_SERVER_URL;

/** Fetch a paginated news list from a given upstream endpoint. */
async function fetchPage(
  endpoint: string,
  params: PageParams,
): Promise<ApiResponse<PageResponse<NewsItem>>> {
  if (USE_PLACEHOLDER) {
    return placeholderNews(params, endpoint);
  }
  return upstreamClient.get<PageResponse<NewsItem>>(endpoint, {
    params: { current: params.current, size: params.size },
  });
}

export const newsServerService = {
  /** Homepage news list (featured press). */
  getHomepage: (params: PageParams) => fetchPage(API_ENDPOINTS.CONTENT.NEWS_HOMEPAGE, params),

  /** Events list (press releases for the news page). */
  getEvents: (params: PageParams) => fetchPage(API_ENDPOINTS.CONTENT.NEWS_EVENTS, params),

  /** LinkedIn posts list. */
  getLinkedin: (params: PageParams) => fetchPage(API_ENDPOINTS.CONTENT.LINKEDIN, params),
};

// ---------------------------------------------------------------------------
// Placeholder news data — aligned with remitech.ai
// ---------------------------------------------------------------------------

/** Featured press news (homepage top section). */
const featuredNews: NewsItem[] = [
  {
    id: "f1",
    title:
      "Built on Sui: Remi Brings Regulated Stablecoin Payments Into Banks, Not Around Them",
    summary:
      "Remi's compliance-native interbank clearing and settlement network enables real-time settlement with balance-sheet treatment for participating financial institutions, simplifying and expanding global payments",
    date: "2025-06-10",
    tag: "Press",
    cover: "",
    link: "https://www.remitech.ai/news",
  },
  {
    id: "f2",
    title:
      "Remi Preemptively Deploys Programmable Compliance Architecture, Fully Aligned with HKMA's Latest Stablecoin Licensing Standards",
    summary:
      "Remi's proprietary interbank cross-border clearing and settlement system has fully implemented end-to-end programmable compliance controls at the smart contract layer, with its technical architecture 100% aligned with the core admission criteria of the Hong Kong Monetary Authority (HKMA)'s inaugural stablecoin licenses.",
    date: "2025-05-22",
    tag: "Press",
    cover: "",
    link: "https://www.remitech.ai/news",
  },
  {
    id: "f3",
    title: "Bison Bank Announces Stablecoin Issuance Under MiCA Framework",
    summary:
      "Bison Bank, a MiCA-licensed European financial institution and strategic partner of Remi Technology, has announced the issuance of compliant stablecoins, with Remi serving as the core settlement network for scaled commercial cross-border application.",
    date: "2025-04-15",
    tag: "Press",
    cover: "",
    link: "https://www.remitech.ai/news",
  },
];

/** Press releases for the dedicated news page (more items than homepage). */
const eventsNews: NewsItem[] = [
  {
    id: "e1",
    title:
      "Built on Sui: Remi Brings Regulated Stablecoin Payments Into Banks, Not Around Them",
    summary:
      "Remi's compliance-native interbank clearing and settlement network enables real-time settlement with balance-sheet treatment for participating financial institutions, simplifying and expanding global payments.",
    date: "2025-06-10",
    tag: "PRESS",
    cover: "",
    link: "https://www.remitech.ai/news",
  },
  {
    id: "e2",
    title:
      "Remi Preemptively Deploys Programmable Compliance Architecture, Fully Aligned with HKMA's Latest Stablecoin Licensing Standards",
    summary:
      "Remi's proprietary interbank cross-border clearing and settlement system has fully implemented end-to-end programmable compliance controls at the smart contract layer, with its technical architecture 100% aligned with the core admission criteria of the Hong Kong Monetary Authority (HKMA)'s inaugural stablecoin licenses.",
    date: "2025-05-22",
    tag: "PRESS",
    cover: "",
    link: "https://www.remitech.ai/news",
  },
  {
    id: "e3",
    title: "Bison Bank Announces Stablecoin Issuance Under MiCA Framework",
    summary:
      "Bison Bank, a MiCA-licensed European financial institution and strategic partner of Remi Technology, has announced the issuance of compliant stablecoins, with Remi serving as the core settlement network for scaled commercial cross-border application.",
    date: "2025-04-15",
    tag: "PRESS",
    cover: "",
    link: "https://www.remitech.ai/news",
  },
  {
    id: "e4",
    title: "Remi Expands Cross-Border Corridors to Latin America",
    summary:
      "Remi announces the expansion of its regulated stablecoin clearing network into key Latin American markets, enabling real-time settlement between partner banks across the region.",
    date: "2025-03-20",
    tag: "NEWS",
    cover: "",
    link: "https://www.remitech.ai/news",
  },
];

/** LinkedIn news (grid cards). */
const linkedinNews: NewsItem[] = [
  {
    id: "l1",
    title: "Remi Supports IDFR 2026: Empowering Global Families",
    summary:
      "Digital innovation is transforming how families send and receive remittances. More people than ever can access safe and affordable digital financial services. Accelerating digital financial inclusion means helping more families make the most of every remittance received.",
    date: "2025-06-30",
    tag: "Event",
    cover: "",
    link: "https://www.remitech.ai/news",
  },
  {
    id: "l2",
    title: "Connecting Global Finance: Remi at Money 20/20 Amsterdam",
    summary:
      "Great to connect with companies and partners across the industry! We appreciated all the thoughtful conversations and look forward to building on them to explore more opportunities together.",
    date: "2025-06-05",
    tag: "Event",
    cover: "",
    link: "https://www.remitech.ai/news",
  },
  {
    id: "l3",
    title: "Remi is moving forward even faster",
    summary:
      "We are proud to join #ForwardFaster, a United Nations Global Compact initiative that brings companies together to accelerate action towards 2030.",
    date: "2025-05-10",
    tag: "Initiative",
    cover: "",
    link: "https://www.remitech.ai/news",
  },
  {
    id: "l4",
    title: "Remi at Singapore FinTech Festival 2025",
    summary:
      "Join Remi at the Singapore FinTech Festival as we showcase our regulated stablecoin infrastructure and discuss the future of cross-border payments with industry leaders.",
    date: "2025-07-15",
    tag: "Event",
    cover: "",
    link: "https://www.remitech.ai/news",
  },
  {
    id: "l5",
    title: "Remi Partners with Leading ASEAN Banks",
    summary:
      "We're excited to announce new partnerships with leading banks across Southeast Asia, expanding our real-time clearing network to serve more communities.",
    date: "2025-04-28",
    tag: "Partnership",
    cover: "",
    link: "https://www.remitech.ai/news",
  },
  {
    id: "l6",
    title: "Inside Remi: Our Engineering Team's Approach to Compliance",
    summary:
      "A deep dive into how Remi's engineering team builds compliance into every layer of our infrastructure, from smart contracts to regulatory reporting.",
    date: "2025-03-12",
    tag: "Insights",
    cover: "",
    link: "https://www.remitech.ai/news",
  },
];

function placeholderNews(
  params: PageParams,
  endpoint: string,
): ApiResponse<PageResponse<NewsItem>> {
  const current = params.current ?? 1;
  const size = params.size ?? 10;
  // Route the correct dataset based on which upstream endpoint was requested.
  let records: NewsItem[];
  if (endpoint === API_ENDPOINTS.CONTENT.LINKEDIN) {
    records = linkedinNews;
  } else if (endpoint === API_ENDPOINTS.CONTENT.NEWS_EVENTS) {
    records = eventsNews;
  } else {
    records = featuredNews;
  }
  return {
    code: BUSINESS_CODE.SUCCESS,
    data: {
      records,
      total: records.length,
      size,
      current,
    },
  };
}
