"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";

import { solutionItems } from "@/config/navigation";
import { Drawer } from "@/components/ui/drawer-panel";
import { AppLink } from "@/components/layout/app-link";
import { cn } from "@/lib/utils";

/**
 * Drawer menu row content — port of the legacy Vue
 * `AnimatedMenuItemContent.vue`: label + dashed leader + chevron.
 *
 * The legacy version flips a JS `isHovered` flag; here the parent's Tailwind
 * `group/item` hover state drives the same visuals purely in CSS (the
 * `.menu-dash::after` orange fill lives in globals.css).
 */
function AnimatedMenuItemContent({ title }: { title: string }) {
  return (
    <span className="[display:contents]">
      <span className="transition-colors duration-200 group-hover/item:text-[#FF8C2E]">
        {title}
      </span>
      <span className="menu-dash flex-1" />
      <span className="text-[#29221D] transition-colors duration-200 group-hover/item:text-[#FF8C2E]">
        <ChevronRight
          className="size-[16px] transition-all duration-300 group-hover/item:translate-x-[3px]"
          strokeWidth={2}
          aria-hidden="true"
        />
      </span>
    </span>
  );
}

/**
 * Mobile / tablet navigation — migrated from the legacy Vue header's nested
 * drawer pattern:
 *   1. Main menu drawer (top, full-screen) lists all top-level items.
 *   2. Tapping "Solutions" swaps to a second full-screen drawer listing the
 *      six solution sub-items, with a back button to return to the main menu.
 *
 * Controlled by the header via `visible` + `onClose`. Internal sub-state
 * tracks which drawer is showing so the parent stays simple.
 */
export function MobileNav({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const t = useTranslations();
  const [showSolutions, setShowSolutions] = React.useState(false);

  // Reset to the main menu whenever the whole mobile nav closes.
  React.useEffect(() => {
    if (!visible) setShowSolutions(false);
  }, [visible]);

  // Legacy parity: every drawer row is `inter-medium font-[600]` and renders
  // the label + dashed leader + chevron triplet (see AnimatedMenuItemContent).
  const renderItem = (href: string, labelKey: string, accent = false) => (
    <AppLink
      href={href}
      onClick={onClose}
      className={cn(
        "group/item inter-medium flex items-center justify-between gap-[8px] text-[20px] font-[600] transition-all duration-200 md:gap-[12px] md:text-[24px] lg:gap-[8px]",
        accent
          ? "text-[#FF8C2E]"
          : "text-[#29221D] hover:text-[#FF6900]"
      )}
    >
      <AnimatedMenuItemContent title={t(labelKey as never)} />
    </AppLink>
  );

  return (
    <>
      {/* Main menu drawer */}
      <Drawer
        visible={visible && !showSolutions}
        direction="top"
        height="100vh"
        showClose
        maskClosable
        zIndex={1000}
        aria-label="Mobile navigation"
        onClose={onClose}
      >
        <div className="flex min-h-full flex-col gap-[12px] px-[24px] pb-[32px] pt-[72px] text-[24px]">
          {renderItem("/#top", "Nav.home")}
          <button
            type="button"
            onClick={() => setShowSolutions(true)}
            className="group/item inter-medium flex items-center justify-between gap-[8px] text-left text-[20px] font-[600] text-[#29221D] transition-all duration-200 hover:text-[#FF6900] md:gap-[12px] md:text-[24px] lg:gap-[8px]"
          >
            <AnimatedMenuItemContent title={t("Nav.solutions.label")} />
          </button>
          {renderItem("/membership", "Nav.membership")}
          {renderItem("/aboutUs", "Nav.about")}
          {/* Legacy parity: the mobile drawer lists Resources *before* News &
              Events — the reverse of the desktop `menuItems` order. */}
          {renderItem("/resources", "Nav.resources")}
          {renderItem("/news", "Nav.news")}
          {renderItem("/compliance", "Nav.compliance")}
          <div className="mb-[34px] mt-[24px] h-px bg-[#9C9086] md:mb-[32px] md:mt-[48px]" />
          {renderItem("/contactUs", "Nav.cta", true)}
        </div>
      </Drawer>

      {/* Solutions sub-menu drawer */}
      <Drawer
        visible={visible && showSolutions}
        direction="top"
        height="100vh"
        showClose={false}
        maskClosable
        zIndex={1001}
        customClass="bg-white/90"
        aria-label="Solutions"
        onClose={() => {
          setShowSolutions(false);
          onClose();
        }}
      >
        <div className="flex min-h-full flex-col bg-white/90">
          {/* Sub-menu header */}
          <div className="flex h-[72px] shrink-0 items-center justify-between p-[24px]">
            <button
              type="button"
              onClick={() => setShowSolutions(false)}
              className="flex h-[24px] w-[24px] items-center justify-center rounded-full text-[#29221D] transition-colors hover:bg-gray-100 hover:text-[#FF6900]"
              aria-label="Back to main menu"
            >
              <img src="/images/icon-back.svg" alt="" aria-hidden="true" width={24} height={24} />
            </button>
            <h2 className="text-[16px] font-semibold text-[#69584E]">
              {t("Nav.solutions.label")}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-[24px] w-[24px] items-center justify-center rounded-full transition-colors hover:bg-gray-100"
              aria-label="Close menu"
            >
              <img src="/images/icon-close.svg" alt="" aria-hidden="true" width={24} height={24} />
            </button>
          </div>
          {/* Sub-menu items */}
          <div className="flex flex-1 flex-col gap-[12px] overflow-y-auto px-[24px] py-[24px] text-[24px]">
            {/* Legacy parity: sub-items render the same label + dash + chevron
                row as the main drawer — no leading product icon. */}
            {solutionItems.map((s) => (
              <AppLink
                key={s.labelKey}
                href={s.href}
                onClick={onClose}
                className="group/item inter-medium flex items-center justify-between gap-[8px] text-[20px] font-[600] text-[#29221D] transition-all duration-200 hover:text-[#FF6900] md:gap-[12px] md:text-[24px] lg:gap-[8px]"
              >
                <AnimatedMenuItemContent title={t(s.labelKey as never)} />
              </AppLink>
            ))}
          </div>
        </div>
      </Drawer>
    </>
  );
}
