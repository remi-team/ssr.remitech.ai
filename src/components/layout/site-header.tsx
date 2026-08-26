"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { MenuDropdown } from "@/components/layout/menu-dropdown";
import { MobileNav } from "@/components/layout/mobile-nav";
// import { ThemeToggle } from "@/components/layout/theme-toggle"; // disabled: light-only for launch
// import { LanguageSwitcher } from "@/components/layout/language-switcher"; // disabled: English-only
import { UserMenu } from "@/components/layout/user-menu";
import { mainNav } from "@/config/navigation";

/**
 * Site header — migrated from the legacy Vue `header.vue`.
 *
 * Behaviour preserved:
 *  • Two visual modes — "overlay" (frosted, dark, transparent until scrolled)
 *    and "solid" (white, shadowed). Driven by `overlay` prop + scroll state.
 *  • Colour-swap logo (white on overlay, dark on solid).
 *  • Desktop xl+ nav via <MenuDropdown>, "Contact Us" outline button.
 *  • Animated 3-line → X hamburger below xl.
 *  • Mobile nav renders the nested two-drawer pattern (main + Solutions).
 *  • User profile icon (login modal / logout dropdown).
 *
 * The header is `fixed` (matching the original) rather than `sticky`, so the
 * hero section is responsible for leaving room / sitting under it.
 */
export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const t = useTranslations();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Scroll state drives the overlay → solid transition.
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The header uses dark styling only when overlay is requested AND not scrolled.
  const useDarkStyle = overlay && !scrolled;

  return (
    <header
      id="header"
      className={cn(
        "fixed left-0 right-0 top-0 z-[101] transition-colors duration-300",
        useDarkStyle
          ? "bg-[radial-gradient(83.65%_94.35%_at_50%_45.64%,rgba(20,15,19,0.20)_0%,rgba(255,255,255,0.20)_100%),rgba(150,149,149,0.30)] backdrop-blur-[20px]"
          : "bg-white shadow-sm"
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1536px] items-center px-[20px] py-[16px] 2xl:px-[32px]">
        {/* Logo */}
        <a
          href="/#top"
          aria-label="Remi"
          className="flex w-[120px] shrink-0 items-center pt-[15px] pb-[20px]"
        >
          <Logo variant={useDarkStyle ? "light" : "dark"} />
        </a>

        {/* Desktop nav (xl+) */}
        <nav className="ml-[40px] hidden h-full items-center gap-[24px] xl:flex">
          <MenuDropdown items={mainNav} dark={useDarkStyle} topOffset={72} />
        </nav>

        <div className="flex-1" />

        {/* Right cluster */}
        <div className="relative flex min-w-[130px] items-center justify-end gap-4">
          <a
            href="/contact"
            className={cn(
              "hidden cursor-pointer border px-[16px] py-[6px] text-[14px] font-[500] transition-colors xl:block",
              useDarkStyle
                ? "border-white text-white hover:bg-[#FF6900] hover:text-white"
                : "border-[#29221D] text-[#29221D] hover:bg-white hover:text-[#FF6900]"
            )}
          >
            {t("Nav.cta")}
          </a>

          {/* Language switcher disabled — English-only. Re-enable when adding locales. */}
          {/* ThemeToggle disabled — light-only for launch. Re-enable when dark mode is needed. */}
          <UserMenu dark={useDarkStyle} />

          {/* Animated hamburger (below xl) */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            className="relative z-50 flex flex-col gap-1 p-2 xl:hidden"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={cn(
                  "block h-0.5 w-[18px] transition-all duration-300",
                  useDarkStyle ? "bg-white" : "bg-[#29221D]",
                  mobileOpen && i === 0 && "translate-y-[7px] rotate-45",
                  mobileOpen && i === 1 && "opacity-0",
                  mobileOpen && i === 2 && "-translate-y-[7px] -rotate-45"
                )}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile / tablet nested drawers */}
      <MobileNav visible={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
