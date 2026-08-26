import { filesServerService } from "@/services/server/files-server-service";
import { errorResponse } from "@/lib/api/cookies";
import type { RangeOptions } from "@/lib/api/types";

/**
 * GET /api/files/download/[id] — BFF bridge for file download.
 *
 * Forwards Range headers for resumable downloads and streams the upstream
 * response body back to the client.
 */
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) {
      return errorResponse(new Error("File id is required"));
    }

    // Parse optional Range header from the client request.
    const rangeHeader = request.headers.get("range");
    let range: RangeOptions | undefined;
    if (rangeHeader) {
      const match = /bytes=(\d+)-(\d*)/.exec(rangeHeader);
      if (match) {
        range = {
          start: Number(match[1]),
          end: match[2] ? Number(match[2]) : undefined,
        };
      }
    }

    const upstreamRes = await filesServerService.download(id, range);

    // Forward the upstream response (body + headers) to the client.
    const headers = new Headers();
    upstreamRes.headers.forEach((v, k) => headers.set(k, v));
    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers,
    });
  } catch (err) {
    return errorResponse(err);
  }
}
