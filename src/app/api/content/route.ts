import { NextResponse } from "next/server";

import { serverContentService } from "@/services/server/server-content-service";

/**
 * BFF endpoint — the "transition bridge" between Client Components
 * and the Service layer. It forwards to the server-side service impl
 * and decorates the response with cache headers for CDN edge caching.
 *
 * GET /api/content → { news, stats, business, clients }
 */
export const revalidate = 3600; // seconds — ISR at the edge

export async function GET() {
  const data = await serverContentService.getAll();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control":
        "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
