import "server-only";

import { TOKEN_CONFIG, HTTP_STATUS } from "@/lib/api/config";
import { cookies } from "next/headers";
import type { UpstreamError } from "@/lib/api/types";

/**
 * Server-side cookie helpers for BFF token management.
 *
 * Tokens are stored in **httpOnly** cookies so client-side JS can never read
 * them. The client only learns auth state through the JSON body returned by
 * the BFF routes (e.g. `{ username, email, status }`).
 */

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
    secure: process.env.NODE_ENV === "production",
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
 * Convert an `UpstreamError` (or any thrown error) into a JSON response with
 * the appropriate HTTP status. Keeps BFF route handlers terse.
 */
export function errorResponse(err: unknown): Response {
  if (err instanceof Error && err.name === "UpstreamError") {
    const e = err as UpstreamError;
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
export function jsonResponse(body: unknown, status = HTTP_STATUS.OK): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
