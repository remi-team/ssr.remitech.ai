"use client";

import * as React from "react";
import { NEWS_IMAGES } from "./images";

/**
 * NewsHero — dark banner hero for the News & Events page.
 *
 * Full-bleed responsive <picture> background (640 / 768 / 1024 / 1280 / 1536
 * breakpoints, webp + jpg). Grid fallback shows when images are absent.
 */
export function NewsHero() {
  return (
    <section
      data-scroll="hero"
      className="relative min-h-[480px] w-full overflow-hidden bg-[#0E0B09] sm:min-h-[540px] md:h-[560px] lg:h-[610px]"
    >
      {/* Grid fallback layer */}
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
        className="absolute left-1/2 top-1/3 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF6900]/15 blur-[140px]"
        aria-hidden="true"
      />

      {/* Responsive banner background */}
      <div className="absolute inset-0">
        <picture>
          <source
            media="(min-width:1536px)"
            srcSet={`${NEWS_IMAGES.hero.image1536}@1x_compressed.webp 1x, ${NEWS_IMAGES.hero.image1536}@2x_compressed.webp 2x`}
            type="image/webp"
          />
          <source
            media="(min-width:1536px)"
            srcSet={`${NEWS_IMAGES.hero.image1536}@1x_compressed.jpg 1x, ${NEWS_IMAGES.hero.image1536}@2x_compressed.jpg 2x`}
            type="image/jpeg"
          />
          <source
            media="(min-width:1280px)"
            srcSet={`${NEWS_IMAGES.hero.image1280}@1x_compressed.webp 1x, ${NEWS_IMAGES.hero.image1280}@2x_compressed.webp 2x`}
            type="image/webp"
          />
          <source
            media="(min-width:1280px)"
            srcSet={`${NEWS_IMAGES.hero.image1280}@1x_compressed.jpg 1x, ${NEWS_IMAGES.hero.image1280}@2x_compressed.jpg 2x`}
            type="image/jpeg"
          />
          <source
            media="(min-width:768px)"
            srcSet={`${NEWS_IMAGES.hero.image768}@1x_compressed.webp 1x, ${NEWS_IMAGES.hero.image768}@2x_compressed.webp 2x`}
            type="image/webp"
          />
          <source
            media="(min-width:768px)"
            srcSet={`${NEWS_IMAGES.hero.image768}@1x_compressed.jpg 1x, ${NEWS_IMAGES.hero.image768}@2x_compressed.jpg 2x`}
            type="image/jpeg"
          />
          <source
            srcSet={`${NEWS_IMAGES.hero.image640}@1x_compressed.webp 1x, ${NEWS_IMAGES.hero.image640}@2x_compressed.webp 2x`}
            type="image/webp"
          />
          <img
            src={`${NEWS_IMAGES.hero.image640}@1x_compressed.webp`}
            alt="Remi Network"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </picture>
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full pb-12 pt-[140px] sm:pt-[160px] md:pt-[180px] lg:pt-[219px]">
        <div className="mx-auto w-full max-w-[1536px] px-6 sm:px-8 md:px-12 lg:px-16">
          <h1 className="mb-4 text-[32px] font-light uppercase text-white sm:mb-5 sm:text-[36px] md:mb-6 md:text-[42px] lg:text-[48px]">
            News &amp; Events
          </h1>
          <div className="max-w-[838px] space-y-3 md:space-y-4">
            <p className="text-[15px] font-light leading-relaxed text-white/80 sm:text-[16px] lg:text-[20px]">
              Press releases, industry insights, and global events. Follow our journey as we build the
              regulated clearing infrastructure for digital finance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
