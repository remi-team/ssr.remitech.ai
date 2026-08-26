import "server-only";

import { WEBSITE_API_ENDPOINTS, REQUEST_CONFIG, TOKEN_CONFIG, HTTP_STATUS } from "./config";
import { ApiResponse, WebsiteApiError } from "./types";

/**
 * Server-side HTTP client for the **website API service** (`remi-website-backend`,
 * the official-site data service providing auth / content / files APIs).
 *
 * This is the single egress point through which all BFF routes talk to that
 * service. It centralises:
 *  • endpoint resolution (from `WEBSITE_API_ENDPOINTS`)
 *  • timeout enforcement (via AbortController)
 *  • Authorization header injection (from the caller-provided token)
 *  • response-envelope normalisation (`{ code, data, message }`)
 *  • error normalisation (`WebsiteApiError` with status + body)
 *
 * Naming convention: each external API service gets its own `<service>ApiClient`
 * (e.g. a future CRM service would add `crmApiClient` with `CRM_API_*` env
 * vars), so multiple services stay distinguishable and extensible.
 *
 * Only runs on the server (`import "server-only"` guard) — service hosts and
 * tokens must never leak to the client bundle.
 */

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "HEAD";

export interface WebsiteApiRequestOptions {
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
  /** Target URL (normally an entry from `WEBSITE_API_ENDPOINTS`). */
  url?: string;
  /** Access token for Authorization. When omitted, no auth header is sent. */
  accessToken?: string | null;
  /** Treat non-JSON responses (e.g. binary streams) — return raw Response. */
  raw?: boolean;
}

/** Build a URL with query params. */
function withParams(url: string, params?: WebsiteApiRequestOptions["params"]): string {
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
export async function websiteApiFetch<T = unknown>(
  opts: WebsiteApiRequestOptions,
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
      throw new WebsiteApiError("Request timeout", HTTP_STATUS.GATEWAY_TIMEOUT, "TIMEOUT");
    }
    throw new WebsiteApiError(
      "Network error contacting the website API service",
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
    // Try to parse the service error body for a richer message.
    let errorBody: unknown;
    try {
      errorBody = await res.json();
    } catch {
      errorBody = await res.text().catch(() => undefined);
    }
    const message =
      (typeof errorBody === "object" && errorBody !== null
        ? (errorBody as { message?: string }).message
        : undefined) ?? res.statusText;
    throw new WebsiteApiError(message, res.status, String(res.status), errorBody);
  }

  // Parse the standard envelope.
  const json = (await res.json().catch(() => ({}))) as ApiResponse<T>;
  return json;
}

/** Convenience helpers bound to the website API endpoint map. */
export const websiteApiClient = {
  get: <T = unknown>(
    endpointKey: string,
    opts: Omit<WebsiteApiRequestOptions, "method" | "url"> = {},
  ) => websiteApiFetch<T>({ ...opts, method: "GET", url: endpointKey }),

  post: <T = unknown>(
    endpointKey: string,
    opts: Omit<WebsiteApiRequestOptions, "method" | "url"> = {},
  ) => websiteApiFetch<T>({ ...opts, method: "POST", url: endpointKey }),

  put: <T = unknown>(
    endpointKey: string,
    opts: Omit<WebsiteApiRequestOptions, "method" | "url"> = {},
  ) => websiteApiFetch<T>({ ...opts, method: "PUT", url: endpointKey }),

  delete: <T = unknown>(
    endpointKey: string,
    opts: Omit<WebsiteApiRequestOptions, "method" | "url"> = {},
  ) => websiteApiFetch<T>({ ...opts, method: "DELETE", url: endpointKey }),

  head: <T = unknown>(
    endpointKey: string,
    opts: Omit<WebsiteApiRequestOptions, "method" | "url"> = {},
  ) => websiteApiFetch<T>({ ...opts, method: "HEAD", url: endpointKey, raw: true }),

  /** Issue a raw fetch (for streaming / blob responses). */
  raw: (opts: WebsiteApiRequestOptions) => websiteApiFetch<unknown>({ ...opts, raw: true }),
};

/** Re-export the endpoint map for convenience. */
export { WEBSITE_API_ENDPOINTS };
