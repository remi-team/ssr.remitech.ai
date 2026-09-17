import "server-only";

import { createHash } from "node:crypto";

import {
  WEBSITE_API_ENDPOINTS,
  REQUEST_CONFIG,
  TOKEN_CONFIG,
  HTTP_STATUS,
  BUSINESS_CODE,
} from "./config";
import { ApiResponse, LoginResult, WebsiteApiError } from "./types";
import { clearTokens, getRefreshToken, setTokenPair } from "./cookies";

/**
 * Server-side HTTP client for the **website API service** (`remi-website-backend`,
 * the official-site data service providing auth / content / files APIs).
 *
 * This is the single egress point through which all BFF routes talk to that
 * service. It centralises:
 *  • endpoint resolution (from `WEBSITE_API_ENDPOINTS`)
 *  • timeout enforcement (via AbortController)
 *  • Authorization header injection (from the caller-provided token)
 *  • transparent 401 → refresh → single replay for idempotent verbs
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
  /**
   * Opt out of the 401 → refresh → replay path. Set it on the endpoints that
   * *own* the session (`auth/refresh`, `auth/login`) so a failure there can
   * never recurse back into a renewal attempt.
   */
  allowRefresh?: boolean;
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

/** Business envelope success check (`200`, plus the service's `0` variant). */
function isSuccessCode(code: unknown): boolean {
  return code === BUSINESS_CODE.SUCCESS || code === BUSINESS_CODE.SUCCESS_ALT;
}

/**
 * Renewals, bucketed by a digest of the refresh token.
 *
 * Two things are being balanced here, and the 2026-09-16 re-test showed both:
 *
 *  • One Node process serves every visitor, so a single module-level promise
 *    would hand user A's new access token to user B's replayed request. The
 *    bucket key keeps renewals scoped to one session (the raw token never sits
 *    in the map).
 *  • A single page fires several authenticated BFF calls at once, they all get
 *    401, and they all reach this branch. If the entry were dropped the moment
 *    it settled, the slowest of those callers would start a *second* renewal —
 *    measured at 2 out of 3 concurrent requests on a warm loopback. Against a
 *    rotating `auth/refresh` that second call presents an already-consumed
 *    token, fails, and the resulting `clearTokens()` would log out the session
 *    the first call had just renewed. So the outcome is reused for a short
 *    window: same session, same access token, no second round trip.
 */
const RENEWAL_REUSE_MS = 2000;
const MAX_TRACKED_RENEWALS = 200;

/** A freshly minted pair from `auth/refresh`. */
interface RenewedPair {
  accessToken: string;
  refreshToken?: string;
}

interface RenewalEntry {
  promise: Promise<RenewedPair | null>;
  /** Set when the renewal resolved; drives the reuse window. */
  settledAt: number;
}

const renewals = new Map<string, RenewalEntry>();

/** Short non-reversible bucket key — the raw token never sits in the map. */
function renewalKey(refreshToken: string): string {
  return createHash("sha256").update(refreshToken).digest("hex").slice(0, 16);
}

/**
 * Decode a JWT access token's `exp` claim (ms since epoch), or `null` when the
 * token is opaque / malformed / carries no expiry.
 *
 * The website API's `auth/refresh` endpoint sits behind the *same* JWT filter
 * as every other authenticated route: without a still-valid access token it
 * answers `A0230 Access Token Invalid` no matter what refresh token is posted
 * (verified against SIT). A purely reactive "refresh after the 401" therefore
 * can never recover an expired session — the refresh call is rejected for the
 * very reason it was made. Renewal has to happen *proactively*, while the token
 * is still valid, which is what the decoded `exp` lets us time.
 */
function decodeTokenExpiry(token: string): number | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(b64, "base64").toString("utf8");
    const exp = (JSON.parse(json) as { exp?: unknown }).exp;
    return typeof exp === "number" && Number.isFinite(exp) ? exp * 1000 : null;
  } catch {
    return null;
  }
}

/**
 * Exchange the refresh token for a new pair. Network only — persisting it is
 * left to `renewSession`, because a shared promise resolves inside the
 * *first* caller's request context and its `cookies()` store belongs to that
 * response alone; every caller has to write its own `Set-Cookie`.
 *
 * Posted straight to the service instead of going back through
 * `websiteApiFetch`: the client would otherwise recurse into its own renewal
 * branch, and importing the auth service here would close a require cycle.
 * Returns `null` when the session is genuinely dead.
 */
async function renewAccessToken(
  refreshToken: string,
  currentAccessToken?: string | null,
): Promise<RenewedPair | null> {
  const key = renewalKey(refreshToken);
  const existing = renewals.get(key);
  if (existing && (!existing.settledAt || Date.now() - existing.settledAt < RENEWAL_REUSE_MS)) {
    return existing.promise;
  }

  if (renewals.size >= MAX_TRACKED_RENEWALS) {
    // Idle sessions must not accumulate entries forever.
    const now = Date.now();
    for (const [k, entry] of renewals) {
      if (entry.settledAt && now - entry.settledAt >= RENEWAL_REUSE_MS) renewals.delete(k);
    }
  }

  const entry: RenewalEntry = {
    promise: null as unknown as Promise<RenewedPair | null>,
    settledAt: 0,
  };
  entry.promise = (async () => {
    try {
      const res = await fetch(WEBSITE_API_ENDPOINTS.AUTH.REFRESH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // `auth/refresh` is itself behind the JWT filter — it rejects the
          // call with `A0230` unless a valid access token is presented, so the
          // current (still-valid, pre-expiry) token has to ride along. Omitting
          // it is why the earlier reactive-only attempt never renewed anything.
          ...(currentAccessToken
            ? { Authorization: `${TOKEN_CONFIG.TOKEN_PREFIX}${currentAccessToken}` }
            : {}),
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
        cache: "no-store",
      });
      if (!res.ok) return null;
      const envelope = (await res
        .json()
        .catch(() => null)) as ApiResponse<LoginResult> | null;
      const data = envelope?.data;
      const accessToken = data?.accessToken ?? data?.access_token;
      if (!accessToken || !isSuccessCode(envelope?.code)) return null;
      return { accessToken, refreshToken: data?.refreshToken ?? data?.refresh_token };
    } catch {
      return null;
    } finally {
      entry.settledAt = Date.now();
    }
  })();
  renewals.set(key, entry);
  return entry.promise;
}

/**
 * Renew the current session, or end it.
 *
 * `currentAccessToken` is presented to `auth/refresh` (the endpoint is itself
 * JWT-gated). `clearOnFailure` decides whether a failed renewal tears the
 * session down: the reactive 401 path wants that (a rejected refresh there
 * means the session is genuinely dead), the proactive pre-expiry path does not
 * (a transient renewal hiccup must never log an otherwise-valid user out — the
 * request simply proceeds on the still-valid token).
 */
async function renewSession(
  currentAccessToken?: string | null,
  opts: { clearOnFailure?: boolean } = {},
): Promise<string | null> {
  const { clearOnFailure = true } = opts;
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      if (clearOnFailure) await clearTokens();
      return null;
    }
    const renewed = await renewAccessToken(refreshToken, currentAccessToken);
    if (!renewed) {
      if (clearOnFailure) await clearTokens();
      return null;
    }
    // Per-response, so each concurrent caller that shared the renewal still
    // hands the browser the new pair.
    await setTokenPair(renewed.accessToken, renewed.refreshToken);
    return renewed.accessToken;
  } catch {
    // `cookies().set()` throws outside a request scope (e.g. inside a Server
    // Component); losing the renewal there must not break the caller.
    return null;
  }
}

/** Issue one upstream call, with the shared timeout / transport error mapping. */
async function sendWithTimeout(
  target: string,
  method: HttpMethod,
  headers: Record<string, string>,
  body: BodyInit | undefined,
  timeout: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(target, {
      method,
      headers,
      body,
      signal: controller.signal,
      // `next` revalidation is opt-in per route; default to no-store for mutations.
      cache: method === "GET" ? "default" : "no-store",
    });
  } catch (err) {
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
    allowRefresh = true,
  } = opts;

  const target = withParams(url ?? "", params);

  /*
   * Proactive just-in-time renewal.
   *
   * `auth/refresh` only works while the access token is still valid (it is
   * behind the same JWT filter), so renewal must happen *before* expiry, not
   * after a 401. On every authenticated call we decode the token's `exp`; when
   * it is valid but inside the refresh threshold we renew first and use the
   * fresh token. This is what keeps the login-gated `/player` streaming: the
   * page's file-list / video-info calls renew on mount, and each subsequent
   * video Range request re-checks, so a long playback never crosses the expiry
   * boundary. Failures are non-destructive — the request proceeds on the
   * current (still-valid) token and only a real upstream 401 tears it down.
   */
  let effectiveToken = accessToken ?? null;
  if (effectiveToken && allowRefresh) {
    const expiry = decodeTokenExpiry(effectiveToken);
    const now = Date.now();
    if (expiry !== null && expiry > now && expiry - now < TOKEN_CONFIG.REFRESH_THRESHOLD) {
      const renewed = await renewSession(effectiveToken, { clearOnFailure: false });
      if (renewed) effectiveToken = renewed;
    }
  }

  // Assemble headers.
  const finalHeaders: Record<string, string> = { Accept: "application/json", ...headers };
  if (effectiveToken) {
    finalHeaders.Authorization = `${TOKEN_CONFIG.TOKEN_PREFIX}${effectiveToken}`;
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

  let res = await sendWithTimeout(target, method, finalHeaders, reqBody, timeout);

  /*
   * 401 → renew → replay (last-resort fallback).
   *
   * The access token is shorter-lived than the 7-day cookie. The proactive
   * renewal above is the primary defence; this branch only catches the case
   * where a token lapsed between two calls (e.g. a clock-skewed `exp`, or a
   * request that skipped the pre-check). Note the backend limitation: because
   * `auth/refresh` is itself JWT-gated, a *fully* expired token cannot be
   * renewed here — the replay simply fails and the session is torn down so the
   * client shows the sign-in dialog. That is why keeping the token fresh
   * proactively (never letting it reach expiry during an active session) is
   * what actually fixes the login-gated video playback reported on 2026-09-16.
   *
   * Deliberately narrow:
   *  • only for requests that actually sent a token — public endpoints cannot
   *    renew anything and would just churn the cookie jar;
   *  • only for `GET`/`HEAD`. Re-issuing a mutation risks a duplicate submit, a
   *    consumed `FormData` stream cannot be replayed at all, and renewing on a
   *    `logout` that 401s would resurrect the session the user just dropped.
   *    Mutations surface the 401 instead; the client's retry then rides on the
   *    next idempotent read's renewal;
   *  • exactly one attempt. A second 401 is a real authentication failure.
   */
  if (
    allowRefresh &&
    effectiveToken &&
    res.status === HTTP_STATUS.UNAUTHORIZED &&
    (method === "GET" || method === "HEAD") &&
    !formData
  ) {
    const renewed = await renewSession(effectiveToken);
    if (renewed) {
      res = await sendWithTimeout(
        target,
        method,
        { ...finalHeaders, Authorization: `${TOKEN_CONFIG.TOKEN_PREFIX}${renewed}` },
        reqBody,
        timeout,
      );
    }
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
