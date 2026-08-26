"use client";

import * as React from "react";
import { CBP_IMAGES } from "./images";

/**
 * CbpHero — dark hero banner for the Cross-Border Payment solution page.
 *
 * Migrated from legacy Vue `CrossBorderPayment.vue` hero section.
 * Features:
 *  • Responsive <picture> background (solution-bg6_*.jpg) with grid fallback
 *  • Title: "CROSS-BORDER PAYMENT"
 *  • Two description paragraphs
 */

export function CbpHero() {
  return (
    <section className="relative min-h-[480px] w-full overflow-hidden sm:min-h-[540px] md:h-[560px] lg:h-[610px]">
      {/* Grid overlay fallback (renders behind the picture) */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF6900]/15 blur-[140px]"
        aria-hidden="true"
      />

      {/* Responsive picture */}
      <div className="absolute inset-0">
        <picture>
          <source media="(min-width:1536px)" srcSet={CBP_IMAGES.hero.bg1536} />
          <source media="(min-width:1280px)" srcSet={CBP_IMAGES.hero.bg1280} />
          <source media="(min-width:768px)" srcSet={CBP_IMAGES.hero.bg768} />
          <img
            src={CBP_IMAGES.hero.bg640}
            alt="Remi Network"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </picture>
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full pt-[140px] pb-[48px] sm:pt-[160px] md:pt-[180px] lg:pt-[219px]">
        <div className="mx-auto w-full max-w-[1536px] px-[24px] sm:px-[48px] lg:px-[120px]">
          <h1 className="mb-[16px] text-[32px] uppercase text-white sm:mb-[20px] sm:text-[36px] md:mb-[24px] md:text-[42px] lg:text-[48px]">
            CROSS-BORDER<br className="lg:hidden" /> PAYMENT
          </h1>
          <div className="max-w-[810px] space-y-[12px] sm:space-y-[14px] md:space-y-[16px]">
            <p className="text-[15px] leading-relaxed text-white/80 sm:text-[16px] lg:text-[20px]">
              Remi Inter-bank Cross-border Clearing and Settlement System
              creates an efficient, secure, highly compliant, and
              cost-effective network for peer-to-peer transactions among
              regulated institutions globally.
            </p>
            <p className="text-[15px] leading-relaxed text-white/80 sm:text-[16px] lg:text-[20px]">
              SWIFT-compatible, light-touch integration — live in weeks. Banks
              can route transactions via Remi or traditional networks with zero
              disruption.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
