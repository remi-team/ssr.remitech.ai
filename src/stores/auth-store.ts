"use client";

import { create } from "zustand";

import { authService } from "@/lib/auth/auth-service";
import type { UserInfo } from "@/lib/api/types";

/**
 * Auth store — migrated from the legacy Vue `useAuthStore` (Pinia).
 *
 * Key architectural change from the legacy system: **tokens are no longer
 * stored in localStorage**. Instead, the BFF stores them in httpOnly cookies
 * that client-side JavaScript cannot read. This store only mirrors the user
 * *profile* (username / email / status) for UI display, and re-hydrates by
 * reading the cached profile from localStorage — mirroring the legacy Vue
 * `checkAuth()` which never called the `/api/auth/user` endpoint.
 *
 * Security benefit: XSS attacks cannot exfiltrate tokens because they are
 * never accessible to client-side JS.
 */

interface AuthState {
  isLoggedIn: boolean;
  username: string;
  userInfo: UserInfo | null;
  /** True while hydrating the session on mount. */
  isHydrating: boolean;

  /** Persist a successful login (user profile only — tokens go to cookies). */
  setAuth: (info: UserInfo) => void;
  /** Clear the local mirror (call BFF logout to clear cookies). */
  clearAuth: () => void;
  /** Logout via BFF (clears httpOnly cookies) + local state. */
  logout: () => Promise<void>;
  /** Re-hydrate the session from the cached localStorage profile. */
  hydrate: () => Promise<void>;
}

const USER_KEY = "remi.user";

function readLS(key: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}
function writeLS(key: string, value: string | null) {
  if (typeof window === "undefined") return;
  if (value === null) window.localStorage.removeItem(key);
  else window.localStorage.setItem(key, value);
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  username: "",
  userInfo: null,
  isHydrating: false,

  setAuth: (info) => {
    // Cache the user profile in localStorage for instant UI hydration on
    // subsequent mounts (tokens are in httpOnly cookies, not here).
    writeLS(USER_KEY, JSON.stringify(info));
    set({ isLoggedIn: true, username: info.username, userInfo: info });
  },

  clearAuth: () => {
    writeLS(USER_KEY, null);
    set({ isLoggedIn: false, username: "", userInfo: null });
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // Even if the BFF logout fails, clear local state.
    }
    writeLS(USER_KEY, null);
    set({ isLoggedIn: false, username: "", userInfo: null });
  },

  hydrate: async () => {
    set({ isHydrating: true });

    // Restore cached profile from localStorage.
    // Mirrors the legacy Vue `checkAuth()` which reads from Storage without
    // calling the API (the old `fetchUserInfo()` was commented out and never
    // invoked). The website API's `/auth/user` endpoint returns 400, so we
    // align with the old version by relying solely on the cached profile.
    const userRaw = readLS(USER_KEY);
    if (userRaw) {
      try {
        const cached = JSON.parse(userRaw) as UserInfo;
        set({ isLoggedIn: true, username: cached.username, userInfo: cached });
      } catch {
        writeLS(USER_KEY, null);
      }
    }

    set({ isHydrating: false });
  },
}));
