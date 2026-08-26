import { NextResponse } from "next/server";

import { serverContentService } from "@/services/server/server-content-service";

/** GET /api/content/business — BFF bridge for business sectors. */
export const revalidate = 3600;

export async function GET() {
  const data = await serverContentService.getBusiness();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
