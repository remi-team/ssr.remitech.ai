"use client";

import * as React from "react";

/**
 * SolutionsHero — dark hero for the Solutions overview page.
 *
 * Migrated from legacy Vue `solution/index.vue` hero section.
 * Features:
 *  • Full-bleed banner background (768 / 1536 responsive) with grid fallback
 *  • Title: "7*24 Instant Stablecoin Exchange Platform"
 *  • Three description paragraphs about legacy FX pain points
 *  • Remi Swift seal (desktop only)
 */

const HERO_BG_768 = "/images/solution_768x.png";
const HERO_BG_1536 = "/images/solution_1536x.png";
const SEAL_SRC = "/images/lhg-logo.png";

export function SolutionsHero() {
  return (
    <section className="relative isolate min-h-[480px] overflow-hidden bg-[#141110] pt-[140px] sm:min-h-[540px] sm:pt-[155px] md:h-[560px] md:pt-[100px] lg:h-[610px]">
      {/* Grid overlay */}
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

      {/* Banner background */}
      <div
        className="hero-background absolute inset-0 bg-cover bg-center md:bg-[url(/images/solution_1536x.png)]"
        style={{
          backgroundImage:
            "url(/images/solution_768x.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <picture className="absolute inset-0">
          <source media="(min-width:768px)" srcSet={HERO_BG_1536} />
          <img
            src={HERO_BG_768}
            alt=""
            className="h-full w-full object-cover"
            aria-hidden="true"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </picture>
      </div>

      {/* Content */}
      <div className="relative mx-auto flex max-w-[1536px] justify-between px-6 sm:px-8 lg:px-10 xl:px-12">
        <div className="flex w-full min-h-[300px] flex-col items-start justify-between gap-6 pb-[34px] sm:min-h-[340px] md:min-h-[418px] md:flex-row lg:min-h-[500px] md:pb-10 lg:pb-[52px]">
          <div className="md:w-[840px] md:pt-[42px] lg:pt-[56px] xl:pt-[72px]">
            <h1 className="pb-10 text-[32px] uppercase leading-[1.08] tracking-[-0.03em] text-white sm:pb-[50px] sm:text-[36px] md:pb-0 md:text-[42px] lg:text-[48px]">
              7*24 Instant<br className="flex md:hidden" /> Stablecoin
              <br /> Exchange Platform
            </h1>
            <div className="mt-[18px] max-md:max-w-[747px] space-y-5 text-[15px] leading-[1.46] text-white/72 sm:space-y-[30px] sm:text-[16px] md:space-y-[30px] md:text-[18px] lg:text-[20px]">
              <p>
                Every cross-border transaction touches a currency conversion.
                In the legacy system, that spread goes to the
                correspondent&apos;s FX desk — not the originating institution,
                not the client bank, and not the end user.
              </p>
              <p>
                The rail and the margin are owned by different parties. The
                institution moving the money captures neither fully.
              </p>
              <p>
                No direct FX between minor currencies, and need to bridge via
                major currencies, like USD or EUR.
              </p>
            </div>
          </div>
          {/* Remi Swift seal (desktop) */}
          <div className="hidden shrink-0 pt-[35px] md:flex md:pt-[54px] lg:pt-[70px] xl:pt-[88px]">
            <div className="flex h-[72px] w-[60px] flex-col items-center justify-center text-center shadow-[0_20px_55px_rgba(0,0,0,0.22)]">
              <img
                src={SEAL_SRC}
                alt="Remi Swift"
                className="object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.visibility =
                    "hidden";
                }}
              />
              <div className="hidden text-[8px] font-semibold uppercase tracking-[0.26em] text-white/90">
                Remi Swift
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
