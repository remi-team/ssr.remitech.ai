"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

import { useModalStore } from "@/stores/modal-store";
import { Drawer } from "@/components/ui/drawer-panel";
import { cn } from "@/lib/utils";

/**
 * Announcement modals — migrated from the legacy Vue
 * `AnnouncementModal.vue` / `MobileAnnouncementModal.vue`.
 *
 * Legacy production behaviour: the modal auto-shows once per visitor
 * (`hasSeenAnnouncement` in localStorage). Note however that the legacy
 * production build had both renderings **commented out** in
 * `GlobalModals.vue` because the announcement (Sept 2025 GMO-Z.com Forex HK
 * acquisition) had expired. Parity therefore means: keep the full mechanism
 * (store wiring, seen-flag, PC + mobile variants) but ship with **no active
 * announcement**. To re-activate, fill `ANNOUNCEMENT` below.
 */

interface AnnouncementContent {
  /** Bold lead paragraph. */
  heading: string;
  /** Body paragraphs. */
  paragraphs: string[];
}

/** `null` = no active announcement (legacy copy kept below for reference). */
const ANNOUNCEMENT: AnnouncementContent | null = null;

// Legacy (expired, Sept 22 2025) copy, kept for easy re-activation:
// heading: "Remi Holding Group Signs Agreement to Acquire GMO-Z.com Forex HK,
//   Expanding Global Footprint in FX Market"
// paragraphs: the three body paragraphs from the legacy modal.

const SEEN_KEY = "hasSeenAnnouncement";

function hasSeen(): boolean {
  try {
    return window.localStorage.getItem(SEEN_KEY) === "true";
  } catch {
    return true; // Storage unavailable → don't nag.
  }
}

function markSeen() {
  try {
    window.localStorage.setItem(SEEN_KEY, "true");
  } catch {
    // Ignore.
  }
}

/** Auto-show once per visitor when an announcement is active. */
function useAnnouncementAutoShow() {
  const showAnnouncement = useModalStore((s) => s.showAnnouncement);
  React.useEffect(() => {
    if (ANNOUNCEMENT && !hasSeen()) showAnnouncement();
  }, [showAnnouncement]);
}

function AnnouncementBody({ onClose }: { onClose: () => void }) {
  const t = useTranslations("Announcement");
  return (
    <div className="mx-auto w-full max-w-[500px] text-left">
      <div className="mb-8 mt-[24px] flex items-center justify-center gap-[12px]">
        <img
          src="/images/logo-mini.svg"
          alt="Remi Logo"
          className="h-[24px] w-[24px]"
        />
        <h2 className="text-center text-[28px] font-semibold text-[#69584E]">
          {t("title")}
        </h2>
      </div>

      <div className="space-y-6">
        {ANNOUNCEMENT && (
          <div className="space-y-[12px] text-left text-[14px] text-[#9C9086] xl:text-[16px]">
            <p className="pb-[12px] font-medium text-[#69584E]">
              {ANNOUNCEMENT.heading}
            </p>
            {ANNOUNCEMENT.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-8 h-[42px] w-full cursor-pointer rounded-[24px] bg-[#69584E] text-[16px] font-semibold text-white transition-colors duration-200 hover:bg-[#5a4a42]"
        >
          {t("close")}
        </button>
      </div>
    </div>
  );
}

/** PC variant — centered card over a frosted mask (legacy parity). */
export function PcAnnouncementModal({ show }: { show: boolean }) {
  const closeAll = useModalStore((s) => s.closeAll);
  const [mounted, setMounted] = React.useState(false);
  const [entered, setEntered] = React.useState(false);

  useAnnouncementAutoShow();

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!show) {
      setEntered(false);
      return;
    }
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [show]);

  const onClose = () => {
    markSeen();
    closeAll();
  };

  if (!mounted) return null;

  return createPortal(
    <div role="presentation">
      {/* Mask */}
      <div
        aria-hidden={!show}
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-[1000] bg-black/5 backdrop-blur-[10px] transition-opacity duration-300",
          entered ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      {/* Card */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed left-1/2 top-1/2 z-[1001] h-auto w-[90%] max-w-[680px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-300 max-md:max-h-[95vh] max-md:w-[95%]",
          entered ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
        )}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded transition-colors duration-200 hover:bg-black/50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M7.1 18.3C6.7134 18.6866 6.0866 18.6866 5.7 18.3C5.3134 17.9134 5.3134 17.2866 5.7 16.9L10.6 12L5.7 7.1C5.3134 6.7134 5.3134 6.0866 5.7 5.7C6.0866 5.3134 6.7134 5.3134 7.1 5.7L12 10.6L16.9 5.7C17.2866 5.3134 17.9134 5.3134 18.3 5.7C18.6866 6.0866 18.6866 6.7134 18.3 7.1L13.4 12L18.3 16.9C18.6866 17.2866 18.6866 17.9134 18.3 18.3C17.9134 18.6866 17.2866 18.6866 16.9 18.3L12 13.4L7.1 18.3Z"
              fill="#D4CEC9"
            />
          </svg>
        </button>

        <div className="items-center p-12 max-md:p-8 max-md:px-6">
          <AnnouncementBody onClose={onClose} />
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Mobile variant — full-screen top drawer (legacy parity). */
export function MobileAnnouncementModal({ show }: { show: boolean }) {
  const closeAll = useModalStore((s) => s.closeAll);
  const t = useTranslations("Announcement");

  useAnnouncementAutoShow();

  const onClose = () => {
    markSeen();
    closeAll();
  };

  return (
    <Drawer
      visible={show}
      direction="top"
      height="100vh"
      zIndex={1000}
      contentScrollable={false}
      aria-label={t("title")}
      onClose={onClose}
    >
      <div className="flex h-full flex-col bg-white px-6 py-12">
        <div className="mx-auto flex max-w-md flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <AnnouncementBody onClose={onClose} />
          </div>
        </div>
      </div>
    </Drawer>
  );
}
