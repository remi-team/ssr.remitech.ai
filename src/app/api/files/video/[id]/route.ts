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
 *
 * Stream source order (2026-09-17, playback still dead after the 09-16 fix):
 *  1. the authenticated, Range-aware file endpoint `/files/download/{id}`
 *     (QA-verified: restricted files answer 200 logged-in / 401 logged-out);
 *  2. a server-side proxy of the origin url handed back by `video-info` —
 *     the session gate and the chapter lookup above it already passed, and
 *     the raw url never reaches the client DOM.
 * The dedicated upstream `/files/video/{id}` stream is skipped entirely: SIT
 * answers `A0230 Access Token Invalid` there even for a valid Bearer token,
 * and each such 401 used to drag the reactive refresh path into
 * `clearTokens()`, killing the whole session mid-playback.
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

function rangeHeaderFor(range: RangeOptions | undefined): string {
  return `bytes=${range?.start ?? 0}-${range?.end ?? ""}`;
}

/**
 * The chapter lookup doubles as the session heartbeat: it runs the full
 * token-renewal path on every media request (so a long playback never crosses
 * the access-token expiry) and yields the origin url used as fallback source.
 * Returns `null` when the session is gone — the caller surfaces that 401.
 */
async function resolveOriginUrl(id: string): Promise<string | null> {
  const info = await filesServerService.getVideoChapter(id);
  const data = info?.data as { url?: unknown } | null | undefined;
  const url = data?.url;
  return typeof url === "string" && url ? url : null;
}

/**
 * Forward a media response to the `<video>` element.
 *
 * Only the headers a media client needs are copied — upstream hop-by-hop /
 * transfer headers must not leak into our response — and the MIME is pinned
 * to a video type: the site ships `X-Content-Type-Options: nosniff`, so a
 * `application/pdf`-flavoured `Content-Type` on mp4 bytes would make the
 * element refuse the stream outright.
 */
function forwardMedia(upstream: Response, body: BodyInit | null): Response {
  const headers = new Headers();
  const contentRange = upstream.headers.get("content-range");
  if (contentRange) headers.set("Content-Range", contentRange);
  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);
  headers.set("Accept-Ranges", "bytes");
  const upstreamType = upstream.headers.get("content-type") ?? "";
  headers.set(
    "Content-Type",
    upstreamType.startsWith("video/") ? upstreamType : "video/mp4",
  );
  return new Response(body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}

/**
 * Preferred source: the authenticated file endpoint. `allowRefresh: false`
 * keeps a rejecting endpoint from rotating the refresh token on every player
 * retry (the chapter lookup already renews when the token nears expiry).
 */
async function authenticatedChunk(id: string, range: RangeOptions | undefined, method: "GET" | "HEAD") {
  return method === "GET"
    ? filesServerService.downloadVideoChunk(id, range ?? { start: 0 }, { allowRefresh: false })
    : filesServerService.getVideoHead(id, { allowRefresh: false });
}

/** Fallback source: proxy the origin url server-side, anonymous + Range-aware. */
async function originChunk(originUrl: string, range: RangeOptions | undefined, method: "GET" | "HEAD") {
  return fetch(originUrl, {
    method,
    headers: {
      Range: rangeHeaderFor(range),
      Accept: "video/mp4, application/octet-stream;q=0.9, */*;q=0.8",
    },
    cache: "no-store",
  });
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

    const originUrl = await resolveOriginUrl(id);
    if (!originUrl) {
      return jsonResponse({ code: "404", message: "Video stream unavailable" }, 404);
    }

    const authRes = await authenticatedChunk(id, range, "GET");
    if (authRes.ok) return forwardMedia(authRes, authRes.body);

    const originRes = await originChunk(originUrl, range, "GET");
    return forwardMedia(originRes, originRes.body);
  } catch (err) {
    return errorResponse(err);
  }
}

/** HEAD — video metadata (Content-Length, Accept-Ranges). */
export async function HEAD(
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

    const originUrl = await resolveOriginUrl(id);
    if (!originUrl) {
      return jsonResponse({ code: "404", message: "Video stream unavailable" }, 404);
    }

    const authRes = await authenticatedChunk(id, range, "HEAD");
    if (authRes.ok) return forwardMedia(authRes, null);

    const originRes = await originChunk(originUrl, range, "HEAD");
    return forwardMedia(originRes, null);
  } catch (err) {
    return errorResponse(err);
  }
}
