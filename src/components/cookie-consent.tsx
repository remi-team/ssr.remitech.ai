"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

/**
 * CookieConsent — migrated from the legacy Vue `components/CookieConsent.vue`
 * + `composables/useCookieConsent.js`.
 *
 * Behaviour parity:
 *  - Consent is persisted in localStorage (`remi_cookie_consent`) with a
 *    365-day expiry. While undecided the banner slides in from the bottom.
 *  - "Accept All" loads Google Analytics (gtag.js) dynamically;
 *    "Reject All" removes the script and clears the globals.
 *  - A previously accepted consent re-loads gtag immediately on mount.
 */

const COOKIE_CONSENT_KEY = "remi_cookie_consent";
const COOKIE_CONSENT_EXPIRY_DAYS = 365;
const GTAG_ID = "G-449P4SRF6V";
const GTAG_SCRIPT_ID = "ga-gtag";
const GTAG_SRC = `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`;

type ConsentValue = "accepted" | "rejected";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Inject gtag.js into <head>. Safe to call multiple times. */
function loadGtag() {
  if (document.getElementById(GTAG_SCRIPT_ID)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  // Inline bootstrap (must run before the external script loads).
  window.gtag("js", new Date());
  window.gtag("config", GTAG_ID);

  const script = document.createElement("script");
  script.id = GTAG_SCRIPT_ID;
  script.async = true;
  script.src = GTAG_SRC;
  document.head.appendChild(script);
}

/** Remove the gtag.js script and clean up globals. */
function unloadGtag() {
  const el = document.getElementById(GTAG_SCRIPT_ID);
  if (el) el.remove();
  delete window.gtag;
  window.dataLayer = [];
}

function getStoredConsent(): ConsentValue | null {
  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      const { value, expires } = JSON.parse(stored) as {
        value: ConsentValue;
        expires: string;
      };
      if (new Date(expires) > new Date()) return value;
      window.localStorage.removeItem(COOKIE_CONSENT_KEY);
    }
  } catch {
    window.localStorage.removeItem(COOKIE_CONSENT_KEY);
  }
  return null;
}

function saveConsent(value: ConsentValue) {
  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_CONSENT_EXPIRY_DAYS);
  window.localStorage.setItem(
    COOKIE_CONSENT_KEY,
    JSON.stringify({ value, expires: expires.toISOString() }),
  );
}

export function CookieConsent() {
  const t = useTranslations("CookieConsent");
  const [showBanner, setShowBanner] = React.useState(false);
  // Slide-in transition: the banner mounts hidden, then animates up.
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      setShowBanner(true);
    } else if (stored === "accepted") {
      // Previously accepted — load analytics immediately, no banner.
      loadGtag();
    }
  }, []);

  React.useEffect(() => {
    if (!showBanner) return;
    // Next frame → triggers the CSS transition from translateY(100%).
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [showBanner]);

  const decide = (value: ConsentValue) => {
    saveConsent(value);
    if (value === "accepted") loadGtag();
    else unloadGtag();
    setVisible(false);
    // Keep the banner around while the slide-out transition plays.
    window.setTimeout(() => setShowBanner(false), 400);
  };

  if (!showBanner) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[9999] border-t border-gray-200 bg-white shadow-lg transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-4 px-6 py-4 md:flex-row md:items-center">
        {/* Copy */}
        <p className="flex-1 text-[14px] leading-relaxed text-[#333]">
          {t("message")}{" "}
          <Link href="/cookie-policy" className="text-[#C87533] hover:underline">
            {t("cookiePolicy")}
          </Link>
          <span className="mx-1 text-[#999]">|</span>
          <Link href="/privacy-policy" className="text-[#C87533] hover:underline">
            {t("privacyPolicy")}
          </Link>
        </p>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => decide("rejected")}
            className="cursor-pointer rounded border border-[#333] px-6 py-2.5 text-[14px] font-semibold text-[#333] transition-colors hover:bg-gray-50"
          >
            {t("rejectAll")}
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="cursor-pointer rounded bg-[#1a1a1a] px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#333]"
          >
            {t("acceptAll")}
          </button>
        </div>
      </div>
    </div>
  );
}
