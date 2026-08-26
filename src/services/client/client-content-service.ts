"use client";

import type { ContentService } from "../content-service";
import type {
  BusinessSector,
  ClientLogo,
  NewsItem,
  SiteContent,
  StatItem,
} from "../types";

/**
 * Client-side ContentService implementation.
 *
 * This is the consumer-facing adapter that talks to the BFF
 * (Next.js Route Handlers under /api/content/*). It never knows *how*
 * the BFF resolves data — only the contract.
 *
 * Used by React Query hooks so components stay declarative.
 */

async function http<T>(path: string): Promise<T> {
  const res = await fetch(path, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Content service request failed: ${res.status} ${path}`);
  }
  return res.json() as Promise<T>;
}

export const clientContentService: ContentService = {
  getNews: () => http<NewsItem[]>("/api/content/news"),
  getStats: () => http<StatItem[]>("/api/content/stats"),
  getBusiness: () => http<BusinessSector[]>("/api/content/business"),
  getClients: () => http<ClientLogo[]>("/api/content/clients"),
  getAll: () => http<SiteContent>("/api/content"),
};
