/**
 * Static site-wide configuration for the Remi corporate site
 * (locale-independent). Translatable strings live in /messages/*.json.
 */
export const siteConfig = {
  /** Legal entity / brand name (latin fallback used for metadata + OG). */
  name: "Remi",
  /** Canonical production origin used as metadataBase for relative OG URLs. */
  url: "https://www.remi.tech",
  /** Brand handle shown in footer / social. */
  shortName: "Remi",
  /** Default OG image (fallback when dynamic image is unavailable). */
  ogImage: "/opengraph-image",
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
