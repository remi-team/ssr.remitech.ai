import { contentRepository } from "./content-repository";
import type { ContentService } from "../content-service";

/**
 * Server-side ContentService implementation.
 *
 * Runs inside RSC / API routes and talks directly to the repository
 * (the eventual data source). This is the "final destination" data path —
 * no HTTP hop, no serialization overhead, fully cacheable by Next.
 */
export const serverContentService: ContentService = {
  getNews: () => contentRepository.getNews(),
  getStats: () => contentRepository.getStats(),
  getBusiness: () => contentRepository.getBusiness(),
  getClients: () => contentRepository.getClients(),
  getAll: () => contentRepository.getAll(),
};
