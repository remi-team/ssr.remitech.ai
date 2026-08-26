import { filesServerService } from "@/services/server/files-server-service";
import { errorResponse, jsonResponse } from "@/lib/api/cookies";

/** GET /api/files/video-info/[id] — BFF bridge for video chapter metadata. */
export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) {
      return errorResponse(new Error("File id is required"));
    }
    const res = await filesServerService.getVideoChapter(id);
    return jsonResponse(res);
  } catch (err) {
    return errorResponse(err);
  }
}
