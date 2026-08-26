"use client";

import { BFF_ROUTES } from "@/lib/api/config";
import type {
  ApiResponse,
  FileItem,
  RangeOptions,
  VideoChapter,
} from "@/lib/api/types";

/**
 * Client-side files service — the "interface abstraction" for file operations.
 *
 * Migrated from the legacy Vue `files.js`. Calls the BFF (Next.js Route
 * Handlers under `/api/files/*`), never the upstream directly. The BFF handles
 * token injection (httpOnly cookies), Range forwarding, and response streaming.
 *
 * Key difference from the legacy axios-based client: download methods return
 * the raw `Response` (or a `Blob`) so the browser can stream large files
 * without buffering the entire payload in JS memory.
 */

export const filesService = {
  /** Get the authenticated user's file list. */
  async getFileList(): Promise<ApiResponse<FileItem[]>> {
    const res = await fetch(BFF_ROUTES.FILES.LIST, {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`File list failed: ${res.status}`);
    return res.json() as Promise<ApiResponse<FileItem[]>>;
  },

  /**
   * Download a file by id. Returns a `Blob` for convenience (small/medium
   * files). For very large files, use `downloadFileStream` to get the raw
   * streaming `Response`.
   */
  async downloadFile(
    id: string,
    options: { range?: RangeOptions } = {},
  ): Promise<Blob> {
    const headers: Record<string, string> = { Accept: "application/pdf" };
    if (options.range) {
      headers["Accept-Ranges"] = "bytes";
      headers["Range"] = `bytes=${options.range.start}-${options.range.end ?? ""}`;
    }
    const res = await fetch(`${BFF_ROUTES.FILES.DOWNLOAD}/${id}`, {
      credentials: "same-origin",
      headers,
    });
    if (!res.ok) throw new Error(`Download failed: ${res.status}`);
    return res.blob();
  },

  /** Download a file as a streaming `Response` (for large files). */
  async downloadFileStream(
    id: string,
    options: { range?: RangeOptions } = {},
  ): Promise<Response> {
    const headers: Record<string, string> = {};
    if (options.range) {
      headers["Range"] = `bytes=${options.range.start}-${options.range.end ?? ""}`;
    }
    return fetch(`${BFF_ROUTES.FILES.DOWNLOAD}/${id}`, {
      credentials: "same-origin",
      headers,
    });
  },

  /** Get video chapter / playback metadata. */
  async getVideoChapter(id: string): Promise<ApiResponse<VideoChapter>> {
    const res = await fetch(`${BFF_ROUTES.FILES.VIDEO_INFO}/${id}`, {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`Video info failed: ${res.status}`);
    return res.json() as Promise<ApiResponse<VideoChapter>>;
  },

  /**
   * Download a video chunk (Range). Returns the raw `Response` for streaming
   * (e.g. feeding a `MediaSource` / `video` element).
   */
  async downloadVideoChunk(
    id: string,
    start: number,
    end?: number,
  ): Promise<Response> {
    const headers: Record<string, string> = {
      Accept: "application/octet-stream",
      "Accept-Ranges": "bytes",
      Range: `bytes=${start}-${end ?? ""}`,
    };
    return fetch(`${BFF_ROUTES.FILES.VIDEO}/${id}`, {
      credentials: "same-origin",
      headers,
    });
  },

  /**
   * Get video metadata via HEAD request (Content-Length, Accept-Ranges).
   * Returns the response headers.
   */
  async getVideoHead(id: string): Promise<Headers> {
    const res = await fetch(`${BFF_ROUTES.FILES.VIDEO}/${id}`, {
      method: "HEAD",
      credentials: "same-origin",
      headers: { Accept: "application/octet-stream" },
    });
    if (!res.ok) throw new Error(`Video HEAD failed: ${res.status}`);
    return res.headers;
  },
};
