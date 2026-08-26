import "server-only";

import { API_ENDPOINTS, REQUEST_CONFIG, TOKEN_CONFIG, HTTP_STATUS } from "./config";
import { ApiResponse, UpstreamError } from "./types";

/**
 * Server-side upstream HTTP client.
 *
 * This is the single egress point through which all BFF routes talk to the
 * real backend. It centralises:
 *  • base-URL + endpoint resolution (from `API_ENDPOINTS`)
 *  • timeout enforcement (via AbortController)
 *  • Authorization header injection (from the caller-provided token)
 *  • response-envelope normalisation (`{ code, data, message }`)
 *  • error normalisation (`UpstreamError` with status + body)
 *
 * Only runs on the server (`import "server-only"` guard) — the upstream host
 * and tokens must never leak to the client bundle.
 */

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "HEAD";

export interface UpstreamRequestOptions {
  method?: HttpMethod;
  /** JSON body (will be stringified). */
  body?: unknown;
  /** FormData body (sent as multipart/form-data). */
  formData?: FormData;
  /** Query params appended to the URL. */
  params?: Record<string, string | number | undefined>;
  /** Extra headers. */
  headers?: Record<string, string>;
  /** Request timeout (ms). Defaults to `REQUEST_CONFIG.TIMEOUT`. */
  timeout?: number;
  /** Override the upstream URL (normally derived from API_ENDPOINTS). */
  url?: string;
  /** Access token for Authorization. When omitted, no auth header is sent. */
  accessToken?: string | null;
  /** Treat non-JSON responses (e.g. binary streams) — return raw Response. */
  raw?: boolean;
}

/** Build a URL with query params. */
function withParams(url: string, params?: UpstreamRequestOptions["params"]): string {
  if (!params) return url;
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) sp.append(k, String(v));
  }
  const qs = sp.toString();
  return qs ? `${url}?${qs}` : url;
}

/**
 * Core request method. Returns the parsed `{ code, data, message }` envelope
 * (or a raw `Response` when `raw: true`).
 */
export async function upstream<T = unknown>(
  opts: UpstreamRequestOptions,
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    body,
    formData,
    params,
    headers = {},
    timeout = REQUEST_CONFIG.TIMEOUT,
    url,
    accessToken,
    raw = false,
  } = opts;

  const target = withParams(url ?? "", params);

  // Assemble headers.
  const finalHeaders: Record<string, string> = { Accept: "application/json", ...headers };
  if (accessToken) {
    finalHeaders.Authorization = `${TOKEN_CONFIG.TOKEN_PREFIX}${accessToken}`;
  }
  if (body && !formData) {
    finalHeaders["Content-Type"] = "application/json";
  }

  // Request body.
  let reqBody: BodyInit | undefined;
  if (formData) {
    reqBody = formData; // browser/edge fetch sets the multipart boundary
  } else if (body !== undefined) {
    reqBody = JSON.stringify(body);
  }

  // Timeout via AbortController.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  let res: Response;
  try {
    res = await fetch(target, {
      method,
      headers: finalHeaders,
      body: reqBody,
      signal: controller.signal,
      // `next` revalidation is opt-in per route; default to no-store for mutations.
      cache: method === "GET" ? "default" : "no-store",
    });
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === "AbortError") {
      throw new UpstreamError("Request timeout", HTTP_STATUS.GATEWAY_TIMEOUT, "TIMEOUT");
    }
    throw new UpstreamError(
      "Network error contacting upstream",
      HTTP_STATUS.BAD_GATEWAY,
      "NETWORK_ERROR",
    );
  } finally {
    clearTimeout(timer);
  }

  // Raw mode — let the caller stream the Response (file downloads, HEAD, etc.).
  if (raw) {
    // Wrap raw response in an envelope-like shape for convenience.
    return { code: String(res.status), data: res as unknown as T, message: res.statusText };
  }

  if (!res.ok) {
    // Try to parse the upstream error body for a richer message.
    let upstreamBody: unknown;
    try {
      upstreamBody = await res.json();
    } catch {
      upstreamBody = await res.text().catch(() => undefined);
    }
    const message =
      (typeof upstreamBody === "object" && upstreamBody !== null
        ? (upstreamBody as { message?: string }).message
        : undefined) ?? res.statusText;
    throw new UpstreamError(message, res.status, String(res.status), upstreamBody);
  }

  // Parse the standard envelope.
  const json = (await res.json().catch(() => ({}))) as ApiResponse<T>;
  return json;
}

/** Convenience helpers bound to the endpoint map. */
export const upstreamClient = {
  get: <T = unknown>(
    endpointKey: string,
    opts: Omit<UpstreamRequestOptions, "method" | "url"> = {},
  ) => upstream<T>({ ...opts, method: "GET", url: endpointKey }),

  post: <T = unknown>(
    endpointKey: string,
    opts: Omit<UpstreamRequestOptions, "method" | "url"> = {},
  ) => upstream<T>({ ...opts, method: "POST", url: endpointKey }),

  put: <T = unknown>(
    endpointKey: string,
    opts: Omit<UpstreamRequestOptions, "method" | "url"> = {},
  ) => upstream<T>({ ...opts, method: "PUT", url: endpointKey }),

  delete: <T = unknown>(
    endpointKey: string,
    opts: Omit<UpstreamRequestOptions, "method" | "url"> = {},
  ) => upstream<T>({ ...opts, method: "DELETE", url: endpointKey }),

  head: <T = unknown>(
    endpointKey: string,
    opts: Omit<UpstreamRequestOptions, "method" | "url"> = {},
  ) => upstream<T>({ ...opts, method: "HEAD", url: endpointKey, raw: true }),

  /** Issue a raw fetch (for streaming / blob responses). */
  raw: (opts: UpstreamRequestOptions) => upstream<unknown>({ ...opts, raw: true }),
};

/** Re-export the endpoint map for convenience. */
export { API_ENDPOINTS };
