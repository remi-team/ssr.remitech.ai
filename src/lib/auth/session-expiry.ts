"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useModalStore } from "@/stores/modal-store";

/**
 * Unified session-expiry handling — migrated from the legacy Vue axios
 * interceptor (`request.js`: 401 → `handleTokenExpired()` → clear token) and
 * the legacy route guard (`router/index.js`: `requiresAuth` →
 * `modalStore.showLogin()`).
 *
 * Whenever the client discovers that the session is invalid — either because
 * no cached profile exists (never logged in) or because a BFF call rejected
 * the expired cookie token with HTTP 401 — the app reacts in one uniform way:
 * log the user out (clear the profile mirror + token cookies) and open the
 * global login modal. Pages must NOT invent their own "please log in"
 * panels.
 */

/** True when `err` is a client-service error carrying HTTP 401. */
export function isUnauthorizedError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { status?: unknown }).status === 401
  );
}

/**
 * Uniform reaction to an expired/invalid session: perform a full logout
 * (BFF clears the httpOnly cookies, local mirror is reset) then pop the
 * global login modal so the user can sign in again in place.
 */
export async function handleSessionExpiry(): Promise<void> {
  await useAuthStore.getState().logout();
  useModalStore.getState().showLogin();
}
