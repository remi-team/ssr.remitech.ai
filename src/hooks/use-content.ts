"use client";

import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { clientContentService } from "@/services/client/client-content-service";
import { contentQueryKeys } from "@/services/content-service";
import type {
  BusinessSector,
  ClientLogo,
  NewsItem,
  StatItem,
} from "@/services/types";

/**
 * React Query + Suspense hooks.
 *
 * Each hook uses `useSuspenseQuery`, so the consuming component can be wrapped
 * in a <Suspense> boundary. The Service abstraction means these hooks know
 * nothing about fetch / BFF / repository — they only depend on the interface.
 */
export function useNews() {
  return useSuspenseQuery<NewsItem[]>({
    queryKey: contentQueryKeys.news(),
    queryFn: () => clientContentService.getNews(),
  });
}

export function useStats() {
  return useSuspenseQuery<StatItem[]>({
    queryKey: contentQueryKeys.stats(),
    queryFn: () => clientContentService.getStats(),
  });
}

export function useBusiness() {
  return useSuspenseQuery<BusinessSector[]>({
    queryKey: contentQueryKeys.business(),
    queryFn: () => clientContentService.getBusiness(),
  });
}

export function useClients() {
  return useSuspenseQuery<ClientLogo[]>({
    queryKey: contentQueryKeys.clients(),
    queryFn: () => clientContentService.getClients(),
  });
}
