import { defineRouting } from "next-intl/routing";

/**
 * Central i18n routing configuration (Single Source of Truth).
 * Consumed by the middleware, the request config, <Link/>, useRouter/usePathname.
 *
 * Currently English-only in production. The zh catalogue (`messages/zh.json`)
 * and all per-page zh copy are kept: to re-enable Chinese, add "zh" back to
 * `locales` below (the language switcher reappears automatically once more
 * than one locale is listed).
 */

/**
 * Full set of locales whose content exists in `messages/` and whose page
 * code paths are implemented — even if not yet routed. Used for locale
 * validation/typing so that disabling a language never breaks compilation.
 */
export const AVAILABLE_LOCALES = ["en", "zh"] as const;

export const routing = defineRouting({
  /** Locales actually served. First entry = default. */
  locales: ["en"],
  defaultLocale: "en",
  // Serves the default locale at `/` (no prefix); other locales are prefixed.
  localePrefix: "as-needed",
});

export type Locale = (typeof AVAILABLE_LOCALES)[number];
