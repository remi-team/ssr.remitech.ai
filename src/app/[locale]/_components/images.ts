/**
 * Canonical image asset paths — mirrors the legacy Vue project's `/images/*`
 * convention. All paths are relative to `/public`, so dropping the matching
 * files into `public/images/` later makes them resolve automatically with
 * zero code changes.
 *
 * Keeping the paths in one place means:
 *  • a single source of truth for every image the home page needs
 *  • easy auditing of which assets are still missing
 *  • no scattered string literals across components
 */

export const IMAGES = {
  // --- Hero carousel slides (responsive: 768 / 1280 / 1536) ---
  hero: {
    slide1: { image768: "/images/ba10_768", image1280: "/images/ba10_1280", image1536: "/images/ba10_1536" },
    slide2: { image768: "/images/ba07_768", image1280: "/images/ba07_1280", image1536: "/images/ba07_1536" },
    slide3: { image768: "/images/ba03_768", image1280: "/images/ba03_1280", image1536: "/images/ba03_1536" },
    slide4: { image768: "/images/ba01_768", image1280: "/images/ba01_1280", image1536: "/images/ba01_1536" },
  },

  // --- What Remi Unlocks (4 feature icons) ---
  whatRemi: {
    access: "/images/icon-access.png",
    own: "/images/icon-own.png",
    expand: "/images/icon-expand.png",
    reduce: "/images/icon-reduce.png",
  },

  // --- Product Suite (6 product icons + hover variants) ---
  productSuite: {
    crossBorder: { icon: "/images/icon-cross-border-settlement.png", iconHover: "/images/icon-cross-border-settlement_hover.png" },
    fx: { icon: "/images/icon-fx-treasury.png", iconHover: "/images/icon-fx-treasury_hover.png" },
    stablecoin: { icon: "/images/icon-stablecoin-issuance.png", iconHover: "/images/icon-stablecoin-issuance_hover.png" },
    regtech: { icon: "/images/icon-regtech.png", iconHover: "/images/icon-regtech_hover.png" },
    lc: { icon: "/images/icon-token-lc.png", iconHover: "/images/icon-token-lc_hover.png" },
    cheque: { icon: "/images/icon-e-cheque.png", iconHover: "/images/icon-e-cheque_hover.png" },
  },

  // --- Why Remi (background image) ---
  whyRemi: {
    bg: "/images/why-remi_bg.png",
  },

  // --- Trust & Compliance (4 card background icons) ---
  trust: {
    certifications: "/images/icon-compliance_certifications_bg.png",
    global: "/images/icon-compliance_global_bg.png",
    stablecoin: "/images/icon-compliance_stablecoin_bg.png",
    bison: "/images/icon-compliance_bison_bg.png",
  },

  // --- Who We Are (side image) ---
  whoWeAre: {
    image: "/images/home-multi_1536x.webp",
  },

  // --- UN Commitment (logos) ---
  unCommitment: {
    logoMini: "/images/logo-mini.svg",
    logoGoals: "/images/logo-goals.png",
    logoSdg: "/images/logo-SDG.png",
  },

  // --- Partners (logos row) ---
  partners: {
    sun: "/images/sun.png",
    sui: "/images/sui.png",
    rfi: "/images/rfi.png",
    cregis: "/images/cregis.png",
    efgh: "/images/efgh.png",
  },

  // --- News ---
  news: {
    quote: "/images/icon-quote.png",
    moreIcon: "/images/icon-news-more.png",
    moreIconHover: "/images/icon-news-more_hover.png",
  },
} as const;
