"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Remi brand logo — renders the actual brand SVG from /public/images/.
 *
 * Two variants (matching the legacy Vue header.vue behaviour):
 *  • "dark"  → /images/logo-remi.svg       (dark mark on light backgrounds)
 *  • "light" → /images/logo-remi-white.svg (white mark on dark backgrounds)
 *
 * The parent (SiteHeader / SiteFooter) is responsible for wrapping this
 * in an <a> link to avoid nested-anchor hydration errors.
 */
export function Logo({
  className,
  variant = "dark",
}: {
  className?: string;
  /** "dark" = dark ink on light bg (default); "light" = white on dark bg. */
  variant?: "dark" | "light";
}) {
  const src =
    variant === "light"
      ? "/images/logo-remi-white.svg"
      : "/images/logo-remi.svg";

  return (
    <span className={cn("inline-flex shrink-0 items-center", className)}>
      <img
        src={src}
        alt="Remi"
        className="h-[48px] lg:hidden"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      <img
        src={src}
        alt="Remi"
        className="hidden w-[120px] h-[64px] lg:block"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    </span>
  );
}
