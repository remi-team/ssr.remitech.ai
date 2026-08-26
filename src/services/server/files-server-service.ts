import "server-only";

import { WEBSITE_API_ENDPOINTS } from "@/lib/api/config";
import { websiteApiFetch } from "@/lib/api/website-api-client";
import { getAccessToken } from "@/lib/api/cookies";
import type {
  ApiResponse,
  FileItem,
  RangeOptions,
  VideoChapter,
} from "@/lib/api/types";

/**
 * Server-side files service — calls the website API service (files module).
 *
 * Handles:
 *  • list (authenticated)
 *  • download (Range-aware, streamed)
 *  • video chapter info
 *  • video chunk download (Range)
 *  • video HEAD (metadata)
 */

export const filesServerService = {
  /** Get the authenticated user's file list. */
  async list(): Promise<ApiResponse<FileItem[]>> {
    const accessToken = await getAccessToken();
    const res = await websiteApiFetch<FileItem[]>({
      url: WEBSITE_API_ENDPOINTS.FILES.LIST,
      method: "GET",
      accessToken,
    });
    return res;
  },

  /**
   * Download a file by id. Returns the raw service `Response` so the BFF can
   * stream it to the client. Supports Range requests for resumable downloads.
   */
  async download(
    id: string,
    range?: RangeOptions,
  ): Promise<Response> {
    const url = `${WEBSITE_API_ENDPOINTS.FILES.DOWNLOAD}/${id}`;
    const headers: Record<string, string> = {
      Accept: "application/pdf",
    };
    if (range) {
      headers["Accept-Ranges"] = "bytes";
      headers["Range"] = `bytes=${range.start}-${range.end ?? ""}`;
    }

    const accessToken = await getAccessToken();
    const res = await websiteApiFetch<Response>({
      url,
      method: "GET",
      headers,
      accessToken,
      raw: true,
      timeout: 120000,
    });
    // `res.data` is the raw website API Response (raw mode).
    return (res.data as unknown as Response) ?? new Response(null, { status: 502 });
  },

  /** Get video chapter / playback metadata. */
  async getVideoChapter(id: string): Promise<ApiResponse<VideoChapter>> {
    const accessToken = await getAccessToken();
    return websiteApiFetch<VideoChapter>({
      url: `${WEBSITE_API_ENDPOINTS.FILES.VIDEO_CHAPTER}/${id}`,
      method: "GET",
      accessToken,
    });
  },

  /**
   * Download a video chunk (Range). Returns the raw website API `Response` for
   * streaming. Supports resumable / chunked playback.
   */
  async downloadVideoChunk(
    id: string,
    range: RangeOptions,
  ): Promise<Response> {
    const url = `${WEBSITE_API_ENDPOINTS.FILES.VIDEO_DOWNLOAD}/${id}`;
    const headers: Record<string, string> = {
      Accept: "application/octet-stream",
      "Accept-Ranges": "bytes",
      Range: `bytes=${range.start}-${range.end ?? ""}`,
    };

    const accessToken = await getAccessToken();
    const res = await websiteApiFetch<Response>({
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
   * service `Response` so the BFF can forward its headers.
   */
  async getVideoHead(id: string): Promise<Response> {
    const url = `${WEBSITE_API_ENDPOINTS.FILES.VIDEO_DOWNLOAD}/${id}`;
    const headers: Record<string, string> = { Accept: "application/octet-stream" };

    const accessToken = await getAccessToken();
    const res = await websiteApiFetch<Response>({
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
