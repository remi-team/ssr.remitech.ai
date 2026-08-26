import "server-only";

import { API_ENDPOINTS, BUSINESS_CODE, REQUEST_CONFIG } from "@/lib/api/config";
import { upstream } from "@/lib/api/upstream";
import { getAccessToken } from "@/lib/api/cookies";
import type {
  ApiResponse,
  FileItem,
  RangeOptions,
  VideoChapter,
} from "@/lib/api/types";

/**
 * Server-side files service — calls the upstream files API.
 *
 * Handles:
 *  • list (authenticated)
 *  • download (Range-aware, streamed)
 *  • video chapter info
 *  • video chunk download (Range)
 *  • video HEAD (metadata)
 *
 * Placeholder mode returns mock metadata when no upstream is configured.
 */

const USE_PLACEHOLDER = !process.env.UPSTREAM_API_HOST && !process.env.UPSTREAM_SERVER_URL;

export const filesServerService = {
  /** Get the authenticated user's file list. */
  async list(): Promise<ApiResponse<FileItem[]>> {
    if (USE_PLACEHOLDER) {
      return {
        code: BUSINESS_CODE.SUCCESS,
        data: [
          { id: "f1", name: "Remi-Whitepaper.pdf", type: "pdf", size: 2048000 },
          { id: "f2", name: "Product-Demo.mp4", type: "mp4", size: 52428800 },
          { id: "f3", name: "Compliance-Report.pdf", type: "pdf", size: 1024000 },
        ],
      };
    }
    const accessToken = await getAccessToken();
    const res = await upstream<FileItem[]>({
      url: API_ENDPOINTS.FILES.LIST,
      method: "GET",
      accessToken,
    });
    return res;
  },

  /**
   * Download a file by id. Returns the raw upstream `Response` so the BFF can
   * stream it to the client. Supports Range requests for resumable downloads.
   */
  async download(
    id: string,
    range?: RangeOptions,
  ): Promise<Response> {
    const url = `${API_ENDPOINTS.FILES.DOWNLOAD}/${id}`;
    const headers: Record<string, string> = {
      Accept: "application/pdf",
    };
    if (range) {
      headers["Accept-Ranges"] = "bytes";
      headers["Range"] = `bytes=${range.start}-${range.end ?? ""}`;
    }

    if (USE_PLACEHOLDER) {
      // Return a small placeholder PDF blob.
      const blob = new Blob(["Placeholder PDF content for file " + id], {
        type: "application/pdf",
      });
      return new Response(blob, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="file-${id}.pdf"`,
          "Content-Length": String(blob.size),
        },
      });
    }

    const accessToken = await getAccessToken();
    const res = await upstream<Response>({
      url,
      method: "GET",
      headers,
      accessToken,
      raw: true,
      timeout: 120000,
    });
    // `res.data` is the raw upstream Response (raw mode).
    return (res.data as unknown as Response) ?? new Response(null, { status: 502 });
  },

  /** Get video chapter / playback metadata. */
  async getVideoChapter(id: string): Promise<ApiResponse<VideoChapter>> {
    if (USE_PLACEHOLDER) {
      return {
        code: BUSINESS_CODE.SUCCESS,
        data: {
          id,
          title: "Placeholder Video",
          duration: 120,
          chapters: [
            { start: 0, end: 30, title: "Intro" },
            { start: 30, end: 90, title: "Demo" },
            { start: 90, end: 120, title: "Outro" },
          ],
        },
      };
    }
    const accessToken = await getAccessToken();
    return upstream<VideoChapter>({
      url: `${API_ENDPOINTS.FILES.VIDEO_CHAPTER}/${id}`,
      method: "GET",
      accessToken,
    });
  },

  /**
   * Download a video chunk (Range). Returns the raw upstream `Response` for
   * streaming. Supports resumable / chunked playback.
   */
  async downloadVideoChunk(
    id: string,
    range: RangeOptions,
  ): Promise<Response> {
    const url = `${API_ENDPOINTS.FILES.VIDEO_DOWNLOAD}/${id}`;
    const headers: Record<string, string> = {
      Accept: "application/octet-stream",
      "Accept-Ranges": "bytes",
      Range: `bytes=${range.start}-${range.end ?? ""}`,
    };

    if (USE_PLACEHOLDER) {
      // Return a small placeholder binary chunk.
      const size = (range.end ?? range.start + REQUEST_CONFIG.DOWNLOAD.CHUNK_SIZE) - range.start;
      const buf = new Uint8Array(Math.max(0, size));
      return new Response(buf, {
        status: 206,
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Range": `bytes ${range.start}-${range.end ?? range.start + size - 1}/*`,
          "Content-Length": String(buf.length),
        },
      });
    }

    const accessToken = await getAccessToken();
    const res = await upstream<Response>({
      url,
      method: "GET",
      headers,
      accessToken,
      raw: true,
      timeout: 120000,
    });
    return (res.data as unknown as Response) ?? new Response(null, { status: 502 });
  },

  /**
   * HEAD request for video metadata (size, accept-ranges). Returns the raw
   * upstream `Response` so the BFF can forward its headers.
   */
  async getVideoHead(id: string): Promise<Response> {
    const url = `${API_ENDPOINTS.FILES.VIDEO_DOWNLOAD}/${id}`;
    const headers: Record<string, string> = { Accept: "application/octet-stream" };

    if (USE_PLACEHOLDER) {
      return new Response(null, {
        status: 200,
        headers: {
          "Content-Length": "52428800",
          "Accept-Ranges": "bytes",
          "Content-Type": "application/octet-stream",
        },
      });
    }

    const accessToken = await getAccessToken();
    const res = await upstream<Response>({
      url,
      method: "HEAD",
      headers,
      accessToken,
      raw: true,
      timeout: 60000,
    });
    return (res.data as unknown as Response) ?? new Response(null, { status: 502 });
  },
};
