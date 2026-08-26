"use client";

import * as React from "react";

/**
 * Cheque hero banner — migrated from the legacy Vue ECheque.vue hero section.
 *
 * Behaviour: full-bleed dark hero with responsive `<picture>` background,
 * H1 overlaid on top. Images load from `/public/images/`.
 */
export function ChequeHero() {
  return (
    <section className="relative w-full min-h-[480px] sm:min-h-[540px] md:h-[560px] lg:h-[610px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <picture>
          <source media="(min-width:1536px)" srcSet="/images/solution-bg5_1536x.jpg" />
          <source media="(min-width:1280px)" srcSet="/images/solution-bg5_1280x.jpg" />
          <source media="(min-width:768px)" srcSet="/images/solution-bg5_768x.jpg" />
          <img
            src="/images/solution-bg5_640x.jpg"
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        </picture>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex pt-[140px] sm:pt-[160px] md:pt-[180px] lg:pt-[219px] pb-[48px]">
        <div className="max-w-[1536px] mx-auto px-[24px] sm:px-[48px] lg:px-[120px] w-full">
          <h1 className="font-light text-white text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] uppercase mb-[16px] sm:mb-[20px] md:mb-[24px]">
            E CHEQUE
          </h1>
          <div className="max-w-[838px] space-y-[12px] sm:space-y-[14px] md:space-y-[16px]">
            <p className="text-white/80 text-[15px] sm:text-[16px] lg:text-[20px] font-light leading-relaxed">
              Turn checks into smart, regulated money. A secure, compliant and
              intelligent digital framework for contract payments and supply
              chain finance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
