import { filesServerService } from "@/services/server/files-server-service";
import { errorResponse } from "@/lib/api/cookies";
import type { RangeOptions } from "@/lib/api/types";

/**
 * GET /api/files/video/[id] — BFF bridge for video chunk / streaming download.
 *
 * Supports:
 *  • Range requests (resumable / chunked playback)
 *  • HEAD requests (video metadata — size, accept-ranges)
 *
 * Streams the upstream response back to the client.
 */
export const revalidate = 0;

function parseRange(rangeHeader: string | null): RangeOptions | undefined {
  if (!rangeHeader) return undefined;
  const match = /bytes=(\d+)-(\d*)/.exec(rangeHeader);
  if (!match) return undefined;
  return {
    start: Number(match[1]),
    end: match[2] ? Number(match[2]) : undefined,
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) {
      return errorResponse(new Error("File id is required"));
    }
    const range = parseRange(request.headers.get("range"));
    const upstreamRes = await filesServerService.downloadVideoChunk(id, range ?? { start: 0 });

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

/** HEAD — video metadata (Content-Length, Accept-Ranges). */
export async function HEAD(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) {
      return errorResponse(new Error("File id is required"));
    }
    const upstreamRes = await filesServerService.getVideoHead(id);
    const headers = new Headers();
    upstreamRes.headers.forEach((v, k) => headers.set(k, v));
    return new Response(null, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers,
    });
  } catch (err) {
    return errorResponse(err);
  }
}
