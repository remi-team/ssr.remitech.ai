import { defineRouting } from "next-intl/routing";

/**
 * Central i18n routing configuration (Single Source of Truth).
 * Consumed by the middleware, the request config, <Link/>, useRouter/usePathname.
 *
 * Currently English-only. To add a language back:
 *  1. Add the locale to the `locales` array (first = default).
 *  2. Add the corresponding `messages/{locale}.json` file.
 *  3. Uncomment <LanguageSwitcher /> in site-header.tsx.
 */
export const routing = defineRouting({
  locales: ["en"],
  defaultLocale: "en",
  // Serves the default locale at `/` (no prefix); other locales would be prefixed.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
