"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/** Focusable elements inside the dialog, used for the Tab focus trap. */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * ModalShell — the shared PC-modal scaffolding migrated from the recurring
 * `<Teleport> + mask + Transition` block in the legacy Vue modals
 * (loginModal / regModal / forgotModal / regCallbackModal).
 *
 * It renders:
 *  • a frosted full-viewport mask (click to close)
 *  • a centered, rounded, white card
 *  • a top-right close button
 *  • a two-column split (left content / right "Welcome to REMI" panel)
 *
 * Children are placed in the left content area; the right welcome panel is
 * opt-in via `welcomePanel`.
 *
 * Animations are CSS-transition driven (data-state) to avoid extra deps and
 * to match the Vue `<Transition name="modal">` feel (fade + scale-up).
 */
export interface ModalShellProps {
  show: boolean;
  onClose: () => void;
  /** Optional right-side welcome panel content. */
  welcomePanel?: React.ReactNode;
  /** Constrain the card width/height for the split-panel modals. */
  size?: "md" | "lg";
  /** ARIA dialog label. */
  "aria-label"?: string;
  children: React.ReactNode;
}

export function ModalShell({
  show,
  onClose,
  welcomePanel,
  size = "md",
  "aria-label": ariaLabel,
  children,
}: ModalShellProps) {
  const [mounted, setMounted] = React.useState(false);
  const [entered, setEntered] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!show) {
      setEntered(false);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => {
      document.body.style.overflow = prev;
      cancelAnimationFrame(raf);
    };
  }, [show]);

  // Focus management: move focus into the dialog on open, restore it on
  // close, so keyboard users never land on the masked page behind.
  React.useEffect(() => {
    if (!show) return;
    lastFocusedRef.current = (document.activeElement as HTMLElement) ?? null;
    const card = cardRef.current;
    if (card) {
      const first = card.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      (first ?? card).focus();
    }
    return () => {
      lastFocusedRef.current?.focus();
    };
  }, [show]);

  React.useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Focus trap: Tab cycles only through the dialog's focusable nodes.
      if (e.key !== "Tab" || !cardRef.current) return;
      const focusables = Array.from(
        cardRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !cardRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !cardRef.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  if (!mounted) return null;

  const cardWidth =
    size === "lg" ? "max-w-[1000px]" : "max-w-[780px]";
  const cardHeight = size === "lg" ? "" : "h-[480px]";

  return createPortal(
    <div role="presentation">
      {/* Mask */}
      <div
        aria-hidden={!show}
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-[1000] bg-black/5 backdrop-blur-[10px] transition-opacity duration-300",
          entered ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />
      {/* Card — inert while closed so its controls stay out of the tab order */}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-hidden={!show}
        inert={!show}
        tabIndex={-1}
        className={cn(
          "fixed left-1/2 top-1/2 z-[1001] w-[90%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-300",
          cardWidth,
          cardHeight,
          "max-md:w-[95%] max-md:h-auto max-md:max-h-[95vh]",
          entered
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        )}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={cn(
            "absolute right-5 top-5 z-10 flex h-6 w-6 items-center justify-center rounded transition-colors duration-200",
            size === "lg"
              ? "hover:bg-gray-100"
              : "hover:bg-black/50"
          )}
        >
          <CloseIcon className={size === "lg" ? "text-[#6B7280]" : "text-[#D4CEC9]"} />
        </button>

        <div className="flex h-full max-md:flex-col max-md:h-auto">
          {/* Left content */}
          <div className="flex-1 bg-white">{children}</div>
          {/* Right welcome panel (opt-in) */}
          {welcomePanel && (
            <div className="flex-1 bg-linear-to-br from-black/40 to-black/20 bg-cover bg-center pt-[72px] text-white relative max-md:min-h-[200px]">
              {welcomePanel}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M7.1 18.3C6.7134 18.6866 6.0866 18.6866 5.7 18.3C5.3134 17.9134 5.3134 17.2866 5.7 16.9L10.6 12L5.7 7.1C5.3134 6.7134 5.3134 6.0866 5.7 5.7C6.0866 5.3134 6.7134 5.3134 7.1 5.7L12 10.6L16.9 5.7C17.2866 5.3134 17.9134 5.3134 18.3 5.7C18.6866 6.0866 18.6866 6.7134 18.3 7.1L13.4 12L18.3 16.9C18.6866 17.2866 18.6866 17.9134 18.3 18.3C17.9134 18.6866 17.2866 18.6866 16.9 18.3L12 13.4L7.1 18.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Shared right-side "Welcome to REMI" panel (login/forgot/callback). */
export function WelcomePanel({
  onRegister,
  registerLabel = "Register now",
  notMemberLabel = "Not a member yet?",
}: {
  onRegister: () => void;
  registerLabel?: string;
  notMemberLabel?: string;
}) {
  return (
    <div className="mx-auto max-w-[350px] p-2 px-10 text-center">
      <h2 className="mb-[48px] text-[28px] font-light leading-tight tracking-tight text-white max-md:mb-10 max-md:text-[32px]"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
        Welcome to REMI
      </h2>
      <div className="text-base leading-relaxed text-white/95 max-md:text-sm">
        <span>{notMemberLabel} </span>
        <button
          type="button"
          onClick={onRegister}
          className="font-medium text-white underline underline-offset-[3px] decoration-1 transition-opacity hover:opacity-80"
        >
          {registerLabel}
        </button>
      </div>
    </div>
  );
}

export { X };
