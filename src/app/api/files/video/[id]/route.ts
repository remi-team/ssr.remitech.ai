import { filesServerService } from "@/services/server/files-server-service";
import { errorResponse, jsonResponse, getAccessToken } from "@/lib/api/cookies";
import type { RangeOptions } from "@/lib/api/types";

/**
 * GET /api/files/video/[id] — BFF bridge for video chunk / streaming download.
 *
 * Supports:
 *  • Range requests (resumable / chunked playback)
 *  • HEAD requests (video metadata — size, accept-ranges)
 *
 * Streams the website API response back to the client.
 *
 * The `/player` route is login-gated in the UI, but that gate is only a page:
 * the upstream media used to be reachable by anyone who knew (or sniffed) the
 * direct file URL, which is exactly what the 2026-09-15 re-test reported
 * (功能-3: two mp4s answered `206 Partial Content` while logged out). This BFF
 * is the same-origin replacement the player now uses, so it has to enforce the
 * session itself — reject anonymous pulls before touching the origin.
 */
export const revalidate = 0;

/** 401 envelope for callers without a session cookie, forwarded by both verbs. */
async function unauthenticated(): Promise<Response | null> {
  const accessToken = await getAccessToken();
  if (accessToken) return null;
  return jsonResponse({ code: "401", message: "Not authenticated" }, 401);
}

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
    const denied = await unauthenticated();
    if (denied) return denied;
    const range = parseRange(request.headers.get("range"));
    const serviceRes = await filesServerService.downloadVideoChunk(id, range ?? { start: 0 });

    const headers = new Headers();
    serviceRes.headers.forEach((v, k) => headers.set(k, v));
    return new Response(serviceRes.body, {
      status: serviceRes.status,
      statusText: serviceRes.statusText,
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
    const denied = await unauthenticated();
    if (denied) return denied;
    const serviceRes = await filesServerService.getVideoHead(id);
    const headers = new Headers();
    serviceRes.headers.forEach((v, k) => headers.set(k, v));
    return new Response(null, {
      status: serviceRes.status,
      statusText: serviceRes.statusText,
      headers,
    });
  } catch (err) {
    return errorResponse(err);
  }
}
