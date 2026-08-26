import { filesServerService } from "@/services/server/files-server-service";
import { errorResponse, jsonResponse } from "@/lib/api/cookies";

/** GET /api/files/list — BFF bridge for the authenticated file list. */
export const revalidate = 0;

export async function GET() {
  try {
    const res = await filesServerService.list();
    return jsonResponse(res);
  } catch (err) {
    return errorResponse(err);
  }
}
