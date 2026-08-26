"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { mainNav, solutionItems } from "@/config/navigation";
import { Drawer } from "@/components/ui/drawer-panel";
import { cn } from "@/lib/utils";

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

  const renderItem = (href: string, labelKey: string, accent = false) => (
    <a
      href={href}
      onClick={onClose}
      className={cn(
        "group/item flex items-center justify-between gap-2 text-[20px] font-[600] transition-all duration-200 md:text-[24px]",
        accent
          ? "text-[#FF8C2E]"
          : "text-[#29221D] hover:text-[#FF6900]"
      )}
    >
      <span>{t(labelKey as never)}</span>
      <ArrowRight
        className="h-5 w-5 -translate-x-1 opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100"
        aria-hidden="true"
      />
    </a>
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
        <div className="flex min-h-full flex-col gap-[12px] px-[24px] pb-[32px] pt-[72px]">
          {renderItem("/#top", "Nav.home")}
          <button
            type="button"
            onClick={() => setShowSolutions(true)}
            className="group/item flex items-center justify-between gap-2 text-left text-[20px] font-[600] text-[#29221D] transition-all duration-200 hover:text-[#FF6900] md:text-[24px]"
          >
            <span>{t("Nav.solutions.label")}</span>
            <ArrowRight
              className="h-5 w-5 -translate-x-1 opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100"
              aria-hidden="true"
            />
          </button>
          {renderItem("/membership", "Nav.membership")}
          {renderItem("/about", "Nav.about")}
          {renderItem("/news", "Nav.news")}
          {renderItem("/resources", "Nav.resources")}
          {renderItem("/compliance", "Nav.compliance")}
          <div className="mb-[34px] mt-[24px] h-px bg-[#9C9086] md:mb-[32px] md:mt-[48px]" />
          {renderItem("/contact", "Nav.cta", true)}
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
              <ArrowLeft className="h-5 w-5" />
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
              <ArrowLeft className="h-5 w-5 rotate-45" />
            </button>
          </div>
          {/* Sub-menu items */}
          <div className="flex flex-1 flex-col gap-[12px] overflow-y-auto px-[24px] py-[24px]">
            {solutionItems.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.labelKey}
                  href={s.href}
                  onClick={onClose}
                  className="group/item flex items-center gap-3 text-[20px] font-[600] text-[#29221D] transition-all duration-200 hover:text-[#FF6900] md:text-[24px]"
                >
                  <Icon
                    className="h-5 w-5 text-[#29221D] transition-colors group-hover/item:text-[#FF6900]"
                    aria-hidden="true"
                  />
                  <span>{t(s.labelKey as never)}</span>
                </a>
              );
            })}
          </div>
        </div>
      </Drawer>
    </>
  );
}
