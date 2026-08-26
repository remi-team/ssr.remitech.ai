import type {
  BusinessSector,
  ClientLogo,
  NewsItem,
  SiteContent,
  StatItem,
} from "./types";

/**
 * ContentService — the abstraction the rest of the app depends on.
 *
 * Architecture intent (per the recommended layered approach):
 *   Service layer  = "interface abstraction"
 *   Next.js API    = "BFF / transition bridge"
 *   Server Comp.   = "final destination" (uses the server impl directly)
 *   Client Comp.   = uses the client impl, which calls the BFF over fetch
 *
 * Two implementations live next to this interface:
 *   - `./server/server-content-service`  → used by Server Components / API routes
 *   - `./client/client-content-service`  → used by Client Components via React Query
 */
export interface ContentService {
  getNews(): Promise<NewsItem[]>;
  getStats(): Promise<StatItem[]>;
  getBusiness(): Promise<BusinessSector[]>;
  getClients(): Promise<ClientLogo[]>;
  getAll(): Promise<SiteContent>;
}

/** Stable query keys for React Query cache namespacing. */
export const contentQueryKeys = {
  all: ["content"] as const,
  news: () => [...contentQueryKeys.all, "news"] as const,
  stats: () => [...contentQueryKeys.all, "stats"] as const,
  business: () => [...contentQueryKeys.all, "business"] as const,
  clients: () => [...contentQueryKeys.all, "clients"] as const,
} as const;
