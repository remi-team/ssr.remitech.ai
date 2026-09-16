import "server-only";

import { TOKEN_CONFIG, HTTP_STATUS, BUSINESS_CODE } from "@/lib/api/config";
import { cookies, headers } from "next/headers";
import type { WebsiteApiError } from "@/lib/api/types";

/**
 * Server-side cookie helpers for BFF token management.
 *
 * Tokens are stored in **httpOnly** cookies so client-side JS can never read
 * them. The client only learns auth state through the JSON body returned by
 * the BFF routes (e.g. `{ username, email, status }`).
 */

/**
 * Does this request arrive over TLS?
 *
 * `NODE_ENV` used to decide this, which is wrong for every staging deployment:
 * SIT runs a production build behind an ingress that still serves plain HTTP,
 * so `Secure` cookies were *rejected by the browser on login* — the user saw
 * their name, the token never persisted, and `/api/auth/user` kept answering
 * 401/400 (2026-09-15 re-test, 功能-2). Judge the transport instead of the
 * build mode.
 *
 * `x-forwarded-proto` is what the ingress sets after TLS termination; the
 * comma form covers a multi-hop proxy chain. When it is absent we fall back to
 * the request URL / host, treating loopback as plain HTTP so local dev keeps
 * working without certificates.
 */
async function requestIsSecure(): Promise<boolean> {
  try {
    const h = await headers();
    const proto = h.get("x-forwarded-proto");
    if (proto) {
      const first = proto.split(",")[0]?.trim().toLowerCase();
      if (first === "https") return true;
      if (first === "http") return false;
    }
    const origin = h.get("origin") || h.get("referer");
    if (origin) return origin.startsWith("https://");
    const host = h.get("host") ?? "";
    if (/^(localhost|127\.|\[::1\]|::1|0\.0\.0\.0)(:\d+)?$/i.test(host)) return false;
    return true;
  } catch {
    // Outside a request context (rare, e.g. a build-time call) stay strict.
    return process.env.NODE_ENV === "production";
  }
}

/** Read the access token from the request cookies. */
export async function getAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(TOKEN_CONFIG.ACCESS_TOKEN_KEY)?.value ?? null;
}

/** Read the refresh token from the request cookies. */
export async function getRefreshToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(TOKEN_CONFIG.REFRESH_TOKEN_KEY)?.value ?? null;
}

/** Persist both tokens as httpOnly cookies. */
export async function setTokenPair(accessToken?: string, refreshToken?: string): Promise<void> {
  const store = await cookies();
  const base = {
    httpOnly: true,
    // Per-request, not per-build: see `requestIsSecure`.
    secure: await requestIsSecure(),
    sameSite: "lax" as const,
    path: "/",
    maxAge: TOKEN_CONFIG.COOKIE_MAX_AGE,
  };
  if (accessToken) {
    store.set(TOKEN_CONFIG.ACCESS_TOKEN_KEY, accessToken, base);
  }
  if (refreshToken) {
    store.set(TOKEN_CONFIG.REFRESH_TOKEN_KEY, refreshToken, base);
  }
}

/** Clear both token cookies (logout). */
export async function clearTokens(): Promise<void> {
  const store = await cookies();
  store.delete(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
  store.delete(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
}

/**
 * Convert a `WebsiteApiError` (or any thrown error) into a JSON response with
 * the appropriate HTTP status. Keeps BFF route handlers terse.
 */
export function errorResponse(err: unknown): Response {
  if (err instanceof Error && err.name === "WebsiteApiError") {
    const e = err as WebsiteApiError;
    return new Response(
      JSON.stringify({ code: e.code ?? String(e.status), message: e.message }),
      { status: e.status, headers: { "Content-Type": "application/json" } },
    );
  }
  return new Response(
    JSON.stringify({ code: String(HTTP_STATUS.INTERNAL_SERVER_ERROR), message: "Internal error" }),
    { status: HTTP_STATUS.INTERNAL_SERVER_ERROR, headers: { "Content-Type": "application/json" } },
  );
}

/** Standard JSON success response. */
export function jsonResponse(body: unknown, status: number = HTTP_STATUS.OK): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Map a website API business code to the HTTP status the BFF should return.
 *
 * A failed login / rejected token MUST surface as a 4xx at the HTTP level —
 * passing business failures through as 200 makes authentication look
 * successful to scanners, proxies and clients. Code `2009` is the website
 * API's "Invalid Email or Password" result and maps to 401.
 */
export function businessCodeStatus(code: string): number {
  if (code === BUSINESS_CODE.SUCCESS || code === BUSINESS_CODE.SUCCESS_ALT) {
    return HTTP_STATUS.OK;
  }
  if (code === BUSINESS_CODE.UNAUTHORIZED || code === "2009") {
    return HTTP_STATUS.UNAUTHORIZED;
  }
  if (code === BUSINESS_CODE.FORBIDDEN) return HTTP_STATUS.FORBIDDEN;
  if (code === BUSINESS_CODE.NOT_FOUND) return HTTP_STATUS.NOT_FOUND;
  if (code === BUSINESS_CODE.VALIDATION_ERROR) return HTTP_STATUS.UNPROCESSABLE_ENTITY;
  return HTTP_STATUS.BAD_REQUEST;
}
