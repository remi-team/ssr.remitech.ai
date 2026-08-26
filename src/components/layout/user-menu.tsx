"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";

import { useAuthStore } from "@/stores/auth-store";
import { useModalStore } from "@/stores/modal-store";
import { cn } from "@/lib/utils";

/**
 * User profile menu — migrated to the shared auth + modal stores.
 *
 * Behaviour (mirrors the legacy Vue header):
 *  • clicking the user icon opens the login modal when logged out
 *  • when logged in, it reveals a small dropdown with a greeting + logout
 */
export function UserMenu({ dark = false }: { dark?: boolean }) {
  const t = useTranslations("User");
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const username = useAuthStore((s) => s.username);
  const logout = useAuthStore((s) => s.logout);
  const hydrate = useAuthStore((s) => s.hydrate);
  const showLogin = useModalStore((s) => s.showLogin);

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);

  // Rehydrate any persisted session on mount.
  React.useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Close the dropdown on outside click.
  React.useEffect(() => {
    if (!dropdownOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [dropdownOpen]);

  const onIconClick = () => {
    if (isLoggedIn) {
      setDropdownOpen((v) => !v);
    } else {
      showLogin();
    }
  };

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={onIconClick}
        aria-label={isLoggedIn ? t("greeting", { name: username }) : t("login")}
        className={cn(
          "flex h-6 w-6 items-center justify-center transition-colors",
          dark ? "text-white hover:text-brand" : "text-[#29221D] hover:text-brand"
        )}
      >
        <img
          src="/images/icon-user.svg"
          alt=""
          className={cn(
            "h-5 w-5",
            dark ? "brightness-0 invert" : "",
          )}
          aria-hidden="true"
        />
      </button>

      {/* Logged-in dropdown */}
      {isLoggedIn && dropdownOpen && (
        <div className="absolute right-0 top-8 z-50 w-[140px] rounded-[4px] bg-white px-[12px] py-[8px] shadow-[0_0_15px_0_rgba(0,0,0,0.10)]">
          <div className="absolute -top-[5px] right-[5px] h-0 w-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-white" />
          <div className="mb-[8px] border-b border-gray-100 pb-[8px]">
            <div className="line-clamp-1 text-[12px] font-semibold text-gray-900">
              {t("greeting", { name: username })}
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              await logout();
              setDropdownOpen(false);
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded bg-[#29221D] px-2 py-2 text-[12px] text-white transition-colors hover:bg-[#FF6900]"
          >
            <LogOut className="h-3 w-3" aria-hidden="true" />
            {t("logout")}
          </button>
        </div>
      )}
    </div>
  );
}
