/**
 * Image asset paths for the Cross-Border Payment solution page.
 *
 * All paths are relative to `/public` — drop matching files into
 * `public/images/` to activate them (zero code changes).
 *
 * Used by:
 *   • cbp-hero.tsx — responsive hero background (solution-bg6_*.jpg)
 */
export const CBP_IMAGES = {
  hero: {
    bg640: "/images/solution-bg6_640x.jpg",
    bg768: "/images/solution-bg6_768x.jpg",
    bg1280: "/images/solution-bg6_1280x.jpg",
    bg1536: "/images/solution-bg6_1536x.jpg",
  },
} as const;
