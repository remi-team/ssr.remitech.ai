import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";

import { routing, AVAILABLE_LOCALES } from "@/i18n/routing";

import { HeroCarousel } from "./_components/hero-carousel";
import { WhatRemiUnlocks } from "./_components/what-remi-unlocks";
import { ProductSuite } from "./_components/product-suite";
import { WhyRemi } from "./_components/why-remi";
import { GlobalFootprint } from "./_components/global-footprint";
import { TrustCompliance } from "./_components/trust-compliance";
import { WhoWeAre } from "./_components/who-we-are";
import { UNCommitment } from "./_components/un-commitment";
import { EcosystemVideo } from "./_components/ecosystem-video";
import { NewsSection } from "./_components/news-section";
import { CtaSection } from "./_components/cta-section";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Home page — fully migrated from the legacy Vue `index.vue`.
 *
 * All page-level section components live in the co-located `./_components/`
 * folder (private to this route) to keep the route's composition surface
 * self-contained and discoverable.
 *
 * Section order (matches the original):
 *  1. HeroCarousel     — Ken Burns carousel + scroll-down cue + grid fallback
 *  2. WhatRemiUnlocks  — 4 feature cards
 *  3. ProductSuite     — 6 product cards (icon hover swap)
 *  4. WhyRemi          — 5 expandable cards (3+2 layout)
 *  5. GlobalFootprint  — region grid (map placeholder)
 *  6. TrustCompliance  — 4 compliance cards
 *  7. WhoWeAre         — image + text (three-engine architecture)
 *  8. UNCommitment     — SDG 10.c + partner logos
 *  9. EcosystemVideo   — M3u8Player banner mode + viewport autoplay
 * 10. NewsSection      — featured press + LinkedIn grid (BFF news service)
 * 11. CtaSection       — final CTA
 */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const validLocale = hasLocale(AVAILABLE_LOCALES, locale)
    ? locale
    : routing.defaultLocale;
  setRequestLocale(validLocale);

  return (
    <>
      <HeroCarousel />
      <WhatRemiUnlocks />
      <ProductSuite />
      <WhyRemi />
      <GlobalFootprint />
      <TrustCompliance />
      <WhoWeAre />
      <UNCommitment />
      <EcosystemVideo />
      <NewsSection />
      <CtaSection />
    </>
  );
}
