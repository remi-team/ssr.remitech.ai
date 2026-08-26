"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { NavItem } from "@/config/navigation";

export interface MenuDropdownProps {
  items: NavItem[];
  /** Render in dark/overlay mode (white text, for transparent header). */
  dark?: boolean;
  /** Top offset (px) for the dropdown panel + overlay. */
  topOffset?: number;
}

/**
 * Desktop mega-menu navigation.
 *
 * Migrated from the legacy Vue `menuDropdown.vue`. Preserves:
 *  • hover-to-open full-width dropdown panels (with leave-timer debounce)
 *  • a sliding active indicator bar under the active/hovered top-level item
 *  • a frosted overlay backdrop while a dropdown is open
 *  • active-route highlighting (single-page hash anchors count as active)
 *
 * Pure client component — needs DOM measurements for the indicator bar.
 */
export function MenuDropdown({
  items,
  dark = false,
  topOffset = 72,
}: MenuDropdownProps) {
  const t = useTranslations();
  const rawPathname = usePathname();
  // Strip locale prefix (e.g. /en, /zh) so path-based comparisons match
  // navigation hrefs which are locale-agnostic (e.g. /solutions/cross-border-payment).
  const pathname = React.useMemo(() => {
    // default locale (zh) has no prefix; /en is the only explicit prefix
    return rawPathname.replace(/^\/en(?=\/|$)/, "") || "/";
  }, [rawPathname]);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const leaveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [indicator, setIndicator] = React.useState({
    width: 0,
    left: 0,
    opacity: 0,
  });

  const [activeHash, setActiveHash] = React.useState("");

  // Keep activeHash in sync with the URL hash (for single-page nav highlighting).
  React.useEffect(() => {
    const sync = () => setActiveHash(window.location.hash.replace(/^#/, ""));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  const isActiveRoute = React.useCallback(
    (href?: string) => {
      if (!href) return false;
      // Hash-based route (home page anchors like /#solutions).
      const [pathPart, hash] = href.split("#");
      if (hash) {
        // Only consider the hash active when on the correct base path.
        if (pathPart && pathname !== pathPart) return false;
        if (hash === "top") return !activeHash || activeHash === "top";
        return activeHash === hash;
      }
      // Path-based route (separate pages like /solutions/cross-border-payment).
      // Parent items (e.g. /solutions) match any sub-path; exact match also counts.
      return pathname === href || pathname.startsWith(href + "/");
    },
    [activeHash, pathname]
  );

  const isSubItemActive = React.useCallback(
    (children?: NavItem["children"]) => {
      if (!children) return false;
      return children.some((c) => isActiveRoute(c.href));
    },
    [isActiveRoute]
  );

  const computeActiveId = React.useCallback((): string | null => {
    if (activeMenu) return activeMenu;
    if (hoveredId) return hoveredId;
    for (const item of items) {
      if (item.children) {
        if (isActiveRoute(item.href) || isSubItemActive(item.children))
          return item.labelKey;
      } else if (isActiveRoute(item.href)) {
        return item.labelKey;
      }
    }
    return null;
  }, [activeMenu, hoveredId, items, isActiveRoute, isSubItemActive]);

  const updateIndicator = React.useCallback(() => {
    const activeId = computeActiveId();
    if (!activeId) {
      setIndicator({ width: 0, left: 0, opacity: 0 });
      return;
    }
    const el = itemRefs.current.get(activeId);
    const container = containerRef.current;
    if (!el || !container) {
      setIndicator({ width: 0, left: 0, opacity: 0 });
      return;
    }
    const navRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setIndicator({
      width: elRect.width,
      left: elRect.left - navRect.left,
      opacity: 1,
    });
  }, [computeActiveId]);

  React.useEffect(() => {
    const raf = requestAnimationFrame(updateIndicator);
    window.addEventListener("resize", updateIndicator);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator]);

  React.useEffect(() => {
    requestAnimationFrame(updateIndicator);
  }, [activeMenu, hoveredId, activeHash, updateIndicator]);

  const clearLeaveTimer = () => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };

  const handleItemEnter = (id: string) => {
    clearLeaveTimer();
    setHoveredId(id);
    requestAnimationFrame(updateIndicator);
  };

  const handleItemLeave = () => {
    setHoveredId(null);
    requestAnimationFrame(updateIndicator);
  };

  const handleGroupEnter = (id: string) => {
    clearLeaveTimer();
    setActiveMenu(id);
  };

  const handleGroupLeave = () => {
    clearLeaveTimer();
    leaveTimer.current = setTimeout(() => {
      setActiveMenu(null);
      requestAnimationFrame(updateIndicator);
    }, 120);
  };

  const handleDropdownEnter = () => clearLeaveTimer();

  return (
    <div
      ref={containerRef}
      className="relative flex h-[40px] items-center gap-[24px]"
      role="navigation"
      aria-label="Primary"
    >
      {items.map((item) => {
        const hasSub = !!item.children;
        const active =
          isActiveRoute(item.href) ||
          (hasSub && isSubItemActive(item.children));
        return (
          <div
            key={item.labelKey}
            className="relative flex h-full items-center"
            onMouseEnter={() => hasSub && handleGroupEnter(item.labelKey)}
            onMouseLeave={handleGroupLeave}
          >
            <a
              href={item.href}
              ref={(el) => {
                if (el) itemRefs.current.set(item.labelKey, el);
              }}
              onMouseEnter={() => handleItemEnter(item.labelKey)}
              onMouseLeave={handleItemLeave}
              className={cn(
                "flex items-center gap-1 text-[14px] font-[500] transition-colors duration-300",
                dark
                  ? active
                    ? "text-white font-[600]"
                    : "text-white hover:text-brand"
                  : active
                    ? "text-brand font-[600]"
                    : "text-[#29221D] hover:text-brand"
              )}
            >
              {t(item.labelKey as never)}
              {hasSub && (
                <ChevronDown
                  className={cn(
                    "h-[10px] w-[10px] transition-transform duration-300",
                    activeMenu === item.labelKey ? "rotate-180" : ""
                  )}
                  aria-hidden="true"
                />
              )}
            </a>

            {/* Full-width overlay + dropdown panel */}
            {hasSub && activeMenu === item.labelKey && (
              <>
                <div
                  className="fixed bottom-0 left-0 right-0 bg-black/5 backdrop-blur-[10px]"
                  style={{ top: topOffset, zIndex: 98 }}
                  onMouseEnter={handleGroupLeave}
                />
                <div
                  className="fixed left-0 w-full bg-white/90 shadow-[0_4px_4px_0_rgba(0,0,0,0.02)]"
                  style={{ top: topOffset - 1, zIndex: 100 }}
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleGroupLeave}
                >
                  <div className="mx-auto w-full max-w-[1536px] px-[130px] pb-[56px] pt-[42px]">
                    <p className="text-[18px] font-[500] uppercase tracking-[0.08em] text-[#29221D]">
                      {t(item.labelKey as never)}
                    </p>
                    <div className="mt-[32px] grid grid-cols-3 gap-x-[64px] gap-y-[44px]">
                      {item.children!.map((sub) => {
                        const Icon = sub.icon;
                        const subActive = isActiveRoute(sub.href);
                        return (
                          <a
                            key={sub.labelKey}
                            href={sub.href}
                            className="group/item flex min-h-[108px] flex-col"
                          >
                            <div
                              className={cn(
                                "flex items-start justify-between gap-[16px] border-b pb-[10px] transition-colors duration-200",
                                subActive
                                  ? "border-[#29221D]"
                                  : "border-[#29221D]/20 group-hover/item:border-[#FF8C2E]"
                              )}
                            >
                              <span className="flex items-center gap-2">
                                <Icon
                                  className="h-4 w-4 text-[#29221D] transition-colors group-hover/item:text-brand"
                                  aria-hidden="true"
                                />
                                <span
                                  className={cn(
                                    "text-[16px] font-[600] leading-[1.2] transition-colors duration-200",
                                    subActive
                                      ? "text-[#29221D]"
                                      : "text-[#29221D] group-hover/item:text-[#FF8C2E]"
                                  )}
                                >
                                  {t(sub.labelKey as never)}
                                </span>
                              </span>
                              <ChevronRight
                                className={cn(
                                  "mt-[2px] h-[16px] w-[16px] shrink-0 text-[#29221D] transition-all duration-200",
                                  subActive
                                    ? "translate-x-[2px] text-[#29221D]"
                                    : "group-hover/item:translate-x-[2px] group-hover/item:text-[#FF8C2E]"
                                )}
                                aria-hidden="true"
                              />
                            </div>
                            <p className="mt-[10px] line-clamp-3 text-[14px] leading-[1.32] text-[#4E5969]">
                              {sub.descriptionKey
                                ? t(sub.descriptionKey as never)
                                : ""}
                            </p>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* Sliding active indicator bar */}
      <div
        className="absolute bottom-0 z-[1] h-[2px] bg-brand transition-all duration-300 ease-out"
        style={{
          width: `${indicator.width}px`,
          left: `${indicator.left}px`,
          opacity: indicator.opacity,
        }}
        aria-hidden="true"
      />
    </div>
  );
}
