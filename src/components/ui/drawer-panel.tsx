"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/** Focusable elements inside the panel, used for the Tab focus trap. */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export type DrawerDirection = "left" | "right" | "top" | "bottom";

export interface DrawerProps {
  /** Controlled visibility. */
  visible: boolean;
  /** Slide-in direction. */
  direction?: DrawerDirection;
  /** Width for left/right drawers (number → px, string → as-is). */
  width?: number | string;
  /** Height for top/bottom drawers. */
  height?: number | string;
  /** Let the drawer size to its content. */
  autoWidth?: boolean;
  autoHeight?: boolean;
  /** Title rendered in a bordered header. */
  title?: string;
  /** Show the close (X) button. */
  showClose?: boolean;
  /** Dismiss when the mask is clicked. */
  maskClosable?: boolean;
  /** Scroll the content area. */
  contentScrollable?: boolean;
  /** Stack order. */
  zIndex?: number;
  /** Extra class on the panel. */
  customClass?: string;
  /** Close-button tint. */
  closeButtonColor?: string;
  /** ARIA dialog label. */
  "aria-label"?: string;
  /** Fired after the open transition settles. */
  onOpen?: () => void;
  /** Fired when the user requests to close (mask / close button / Esc). */
  onClose?: () => void;
  children?: React.ReactNode;
}

/**
 * Drawer — a reusable, four-direction slide-in panel.
 *
 * Migrated from the legacy Vue `drawer.vue`. Preserves the full interaction
 * surface: directional slide animation, frosted mask, body-scroll lock,
 * Esc-to-close, click-outside-to-close, configurable title/close button.
 *
 * Rendered via a portal so it always stacks above page content, and animated
 * with CSS transitions (data-state driven) to avoid extra animation deps.
 */
export function Drawer({
  visible,
  direction = "right",
  width = 300,
  height = 300,
  autoWidth = false,
  autoHeight = false,
  title,
  showClose = true,
  maskClosable = true,
  contentScrollable = true,
  zIndex = 100,
  customClass,
  closeButtonColor = "#9C9086",
  "aria-label": ariaLabel,
  onOpen,
  onClose,
  children,
}: DrawerProps) {
  const [mounted, setMounted] = React.useState(false);
  // Tracks whether the *enter* transition has played so we can animate from
  // the hidden state on first show.
  const [entered, setEntered] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => setMounted(true), []);

  // Lock body scroll while open + emit onOpen once the panel is in.
  React.useEffect(() => {
    if (!visible) {
      setEntered(false);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Defer to next frame so the initial (hidden) styles paint first.
    const raf = requestAnimationFrame(() => setEntered(true));
    onOpen?.();
    return () => {
      document.body.style.overflow = prev;
      cancelAnimationFrame(raf);
    };
  }, [visible, onOpen]);

  // Focus management: move focus into the drawer on open, restore it on
  // close, so keyboard users never land on the masked page behind.
  React.useEffect(() => {
    if (!visible) return;
    lastFocusedRef.current = (document.activeElement as HTMLElement) ?? null;
    const panel = panelRef.current;
    if (panel) {
      const first = panel.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      (first ?? panel).focus();
    }
    return () => {
      lastFocusedRef.current?.focus();
    };
  }, [visible]);

  // Esc to close + Tab focus trap within the open panel.
  React.useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panelRef.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, onClose]);

  if (!mounted) return null;

  const panelStyle: React.CSSProperties = { zIndex };
  const isHorizontal = direction === "left" || direction === "right";

  if (isHorizontal) {
    panelStyle.width = autoWidth ? "auto" : typeof width === "number" ? `${width}px` : width;
    panelStyle.maxWidth = "100vw";
    panelStyle.height = autoHeight ? "auto" : "100vh";
    panelStyle.maxHeight = "100vh";
  } else {
    panelStyle.height = autoHeight ? "auto" : typeof height === "number" ? `${height}px` : height;
    panelStyle.maxHeight = "100vh";
    panelStyle.width = autoWidth ? "auto" : "100vw";
    panelStyle.maxWidth = "100vw";
  }

  const positionClass =
    direction === "left"
      ? "top-0 left-0"
      : direction === "right"
        ? "top-0 right-0"
        : direction === "top"
          ? "top-0 left-0"
          : "bottom-0 left-0";

  // Hidden transform per direction (used before `entered` flips true).
  const hiddenTransform =
    direction === "left"
      ? "translateX(-100%)"
      : direction === "right"
        ? "translateX(100%)"
        : direction === "top"
          ? "translateY(-100%)"
          : "translateY(100%)";

  return createPortal(
    <div role="presentation">
      {/* Mask */}
      <div
        aria-hidden={!visible}
        onClick={() => maskClosable && onClose?.()}
        className={cn(
          "fixed inset-0 bg-black/5 backdrop-blur-[10px] transition-opacity duration-300",
          entered ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{ zIndex: zIndex - 5 }}
      />
      {/* Panel — inert while closed so its controls stay out of the tab order */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? title}
        aria-hidden={!visible}
        inert={!visible}
        tabIndex={-1}
        className={cn(
          "fixed flex flex-col bg-white/90 shadow-[0_4px_4px_0_rgba(0,0,0,0.02)] transition-transform duration-300 ease-out",
          positionClass,
          customClass
        )}
        style={{
          ...panelStyle,
          transform: entered ? "translate3d(0,0,0)" : hiddenTransform,
        }}
      >
        {showClose && (
          <div className="absolute right-[24px] top-[12px] z-[10]">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-[24px] w-[24px] items-center justify-center rounded-full transition-colors hover:bg-gray-100"
              style={{ color: closeButtonColor }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {title && (
          <div
            className={cn(
              "border-b border-gray-200 px-6 py-4",
              showClose && "pr-12"
            )}
          >
            <h3 className="text-lg font-semibold text-[#29221D]">{title}</h3>
          </div>
        )}
        <div
          className={cn(
            "flex-1",
            contentScrollable ? "overflow-y-auto" : "overflow-hidden",
            title && "p-6"
          )}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
