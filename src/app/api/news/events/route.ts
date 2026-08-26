import { newsServerService } from "@/services/server/news-server-service";
import { errorResponse, jsonResponse } from "@/lib/api/cookies";
import type { PageParams } from "@/lib/api/types";

/** GET /api/news/events — BFF bridge for events news (paginated, ISR cached). */
export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params: PageParams = {
      current: Number(url.searchParams.get("current") ?? 1),
      size: Number(url.searchParams.get("size") ?? 10),
    };
    const res = await newsServerService.getEvents(params);
    return jsonResponse(res, 200);
  } catch (err) {
    return errorResponse(err);
  }
}
