"use client";

import { BFF_ROUTES } from "@/lib/api/config";
import type {
  ApiResponse,
  ChangePasswordPayload,
  ContactPayload,
  LoginResult,
  RegisterPayload,
  ResetPasswordPayload,
  UserInfo,
} from "@/lib/api/types";

/**
 * Client-side auth service — the "interface abstraction" for auth flows.
 *
 * Migrated from the legacy Vue `auth.js`. All methods call the BFF (Next.js
 * Route Handlers under `/api/auth/*`), never the website API directly. The BFF
 * handles token persistence via httpOnly cookies, so the client never sees
 * raw tokens — only the user profile.
 *
 * Responses mirror the legacy `{ code, data, message }` envelope so modal
 * components read exactly like their Vue originals.
 */

async function bff<T>(
  path: string,
  init?: RequestInit & { json?: unknown },
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = { Accept: "application/json" };
  let body: BodyInit | undefined;
  if (init?.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(init.json);
  } else if (init?.body) {
    body = init.body;
  }
  const res = await fetch(path, { ...init, headers, body, credentials: "same-origin" });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(errBody?.message ?? `Auth request failed: ${res.status} ${path}`);
  }
  return res.json() as Promise<ApiResponse<T>>;
}

export const authService = {
  /** Login — BFF stores tokens in httpOnly cookies, returns user profile. */
  login: (email: string, password: string) =>
    bff<LoginResult>(BFF_ROUTES.AUTH.LOGIN, {
      method: "POST",
      json: { email, password },
    }),

  /** Register a new institutional user. */
  register: (payload: RegisterPayload) =>
    bff<{ email: string }>(BFF_ROUTES.AUTH.REGISTER, { method: "POST", json: payload }),

  /** Contact-us form. */
  contact: (payload: ContactPayload) =>
    bff<null>(BFF_ROUTES.AUTH.CONTACT, { method: "POST", json: payload }),

  /** Email activation (type=reg callback). */
  activate: (email: string, code: string) =>
    bff<boolean>(BFF_ROUTES.AUTH.ACTIVATE, { method: "POST", json: { email, code } }),

  /** Resource review activation (type=review callback). */
  activateResource: (email: string, code: string, operate: string) =>
    bff<boolean>(BFF_ROUTES.AUTH.ACTIVATE_RESOURCE, {
      method: "POST",
      json: { email, code, operate },
    }),

  /** Forgot-password request. */
  forgotPassword: (email: string) =>
    bff<{ email: string }>(BFF_ROUTES.AUTH.FORGOT, { method: "POST", json: { email } }),

  /** Reset password (with email + code + new password). */
  resetPassword: (payload: ResetPasswordPayload) =>
    bff<null>(BFF_ROUTES.AUTH.RESET_PASSWORD, { method: "POST", json: payload }),

  /** Refresh the access token (BFF reads refresh token from cookie). */
  refreshToken: () => bff<LoginResult>(BFF_ROUTES.AUTH.REFRESH, { method: "POST" }),

  /** Logout — clears httpOnly cookies. */
  logout: () => bff<null>(BFF_ROUTES.AUTH.LOGOUT, { method: "DELETE" }),

  /** Get the current user's profile (reads access token from cookie). */
  getUserInfo: () => bff<UserInfo>(BFF_ROUTES.AUTH.USER, { method: "GET" }),

  /** Change password (authenticated). */
  changePassword: (payload: ChangePasswordPayload) =>
    bff<null>(BFF_ROUTES.AUTH.CHANGE_PASSWORD, { method: "PUT", json: payload }),
};
