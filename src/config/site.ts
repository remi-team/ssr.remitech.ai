/**
 * Static site-wide configuration for the Remi corporate site
 * (locale-independent). Translatable strings live in /messages/*.json.
 */
/**
 * Origin the deployment self-identifies with (canonicals, OG URLs, sitemap
 * `<loc>`, robots `Sitemap:` line).
 *
 * Defaults to the production origin so a plain `pnpm build` still emits the
 * public URLs. Every environment must inject its own `SITE_URL` (K8s
 * ConfigMap `remi-frontend-ssr-configmap`) — a sitemap whose `<loc>` entries
 * point at a *different* host than the one serving it is rejected by
 * Google/Bing and makes the SIT staging look like a duplicate-content host
 * (QA BUG-17).
 */
const SITE_URL = (() => {
  const raw = process.env.SITE_URL ?? "https://www.remitech.ai";
  // Normalise: drop any trailing slash so `new URL(path, base)` stays relative.
  return raw.replace(/\/+$/, "");
})();

export const siteConfig = {
  /** Legal entity / brand name (latin fallback used for metadata + OG). */
  name: "Remi",
  /** Canonical origin used as metadataBase for relative OG URLs. */
  url: SITE_URL,
  /** Brand handle shown in footer / social. */
  shortName: "Remi",
  /** Default OG image (fallback when dynamic image is unavailable). */
  ogImage: "/opengraph-image",
  /**
   * Vector brand mark. Referenced by `<link rel="icon">`, the manifest and the
   * Organization JSON-LD `logo`. (`/icon.svg` used to be pointed at here but
   * never existed in `public/`, so the URL silently resolved to the SPA
   * soft-404 — see QA BUG-05.)
   */
  logo: "/logo.svg",
  /** Brand palette — single source of truth for the orange/dark-brown identity. */
  colors: {
    primary: "#FF6900",
    primaryHover: "#FF8C2E",
    ink: "#29221D",
    textMuted: "#6B7280",
    textSubtle: "#4E5969",
    textFaint: "#9CA3AF",
    border: "#E5E7EB",
  },
  /** Social profiles — used for footer links + JSON-LD `sameAs`. */
  social: {
    x: "https://x.com/remitechnology",
    linkedin: "https://www.linkedin.com/company/remi-tech/",
  },
  /** Contact channels surfaced across the site. */
  contacts: [
    { titleKey: "Footer.contact.bd", email: "bd@remitech.ai" },
    { titleKey: "Footer.contact.compliance", email: "compliance@remitech.ai" },
    { titleKey: "Footer.contact.pr", email: "pr@remitech.ai" },
  ],
  /** Headquarters address (used in footer + JSON-LD). */
  address: "",
} as const;

export type SiteConfig = typeof siteConfig;
