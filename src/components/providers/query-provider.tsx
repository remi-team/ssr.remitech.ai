"use client";

import * as React from "react";
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

/**
 * React Query provider (client boundary).
 *
 * A single QueryClient is created per browser session (or per request on the
 * server) so cache state is correctly scoped. Server Components hydrate the
 * initial data via `dehydrate/hydrate`-free prefetching patterns; here we keep
 * it simple and let Suspense boundaries handle loading on the client.
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // BFF responses are cacheable; align client TTL with server revalidate.
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (isServer) return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
