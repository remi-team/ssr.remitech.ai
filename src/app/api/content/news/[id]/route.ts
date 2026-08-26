import { newsServerService } from "@/services/server/news-server-service";
import { errorResponse, jsonResponse } from "@/lib/api/cookies";

/** GET /api/content/news/[id] — BFF bridge for a single news article detail. */

/** Revalidate every 1 hour at the edge (ISR). */
export const revalidate = 3600;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const res = await newsServerService.getDetail(id);
    return jsonResponse(res, 200);
  } catch (err) {
    return errorResponse(err);
  }
}
