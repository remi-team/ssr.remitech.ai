"use client";

import * as React from "react";
import { IMAGES } from "./images";

/**
 * UNCommitment — migrated from "Our Commitment to the UN Global Compact".
 * SDG 10.c commitment + partner logos. All image paths are canonical
 * `/images/*` (resolve when files land in /public/images/).
 */
const partners = [
  { name: "HI SUN", src: IMAGES.partners.sun },
  { name: "Sui", src: IMAGES.partners.sui },
  { name: "RFI", src: IMAGES.partners.rfi },
  { name: "Cregis", src: IMAGES.partners.cregis },
  { name: "EF GH", src: IMAGES.partners.efgh },
];

function SmartImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
      }}
    />
  );
}

export function UNCommitment() {
  return (
    <section data-scroll="commitment" className="pb-0 pt-[60px] lg:pb-0 lg:pt-[100px]">
      <div className="relative mx-auto max-w-[1536px] bg-white px-6 lg:px-[123px]">
        {/* SDG logos row */}
        <div className="mx-auto mb-12 flex max-w-[997px] items-center justify-center gap-4 sm:gap-6 lg:pb-12">
          <div className="flex h-[60px] w-[60px] items-center justify-center">
            <SmartImg src={IMAGES.unCommitment.logoMini} alt="Remi logo" className="h-full w-full object-contain" />
          </div>
          <div className="h-[28px] w-[2px] bg-[#86909C]" aria-hidden="true" />
          <div className="flex h-[60px] w-[328px] items-center justify-center">
            <SmartImg src={IMAGES.unCommitment.logoGoals} alt="UN SDGs logo" className="h-full w-full object-contain" />
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-[997px] pb-12 text-left md:mt-12 md:text-center lg:pb-12 lg:mt-[48px]">
          <h2 className="text-[32px] font-medium text-[#29221D]">
            Our Commitment to the UN Global Compact
          </h2>
          <p className="mx-auto py-3 text-[18px] text-[#4E5969]">
            Remi is a participant of the United Nations Global Compact, committed to aligning our
            strategies and operations with the Ten Principles on human rights, labour, environment and
            anti-corruption.
          </p>
          <p className="mx-auto py-3 text-[18px] text-[#4E5969]">
            We are a signatory to the Forward Faster initiative and the CFO Coalition for the SDGs,
            advancing SDG 10.c to reduce remittance costs and expand financial inclusion for underserved
            communities worldwide.
          </p>
        </div>

        <div className="mx-auto max-w-[997px] pb-12 text-left md:text-center lg:pb-12">
          <div className="mb-6 flex flex-col items-center justify-center gap-6">
            <div className="flex h-16 w-[214px] items-center justify-center">
              <SmartImg src={IMAGES.unCommitment.logoSdg} alt="SDG 10.c logo" className="h-full w-full object-contain" />
            </div>
            <div className="max-w-[600px] text-[18px] leading-[1.8] text-[#4E5969]">
              By 2030, reduce to less than 3 per cent the transaction costs of migrant remittances and
              eliminate remittance corridors with costs higher than 5 per cent
            </div>
          </div>
          <p className="text-[18px] leading-[1.8] text-[#4E5969]">
            Participant since May 2026 · Forward Faster · CFO Coalition for the SDGs
          </p>
        </div>
      </div>

      {/* Partner logos */}
      <div className="mx-auto flex max-w-[1536px] flex-wrap items-center justify-center gap-4 px-6 lg:flex-row">
        <div className="grid grid-cols-2 items-center justify-center gap-1.5 md:flex md:flex-wrap lg:gap-[30px]">
          {partners.map((p) => (
            <div
              key={p.name}
              className="flex h-[80px] w-[180px] items-center justify-center md:h-[126px] md:w-[260px]"
            >
              <SmartImg
                src={p.src}
                alt={p.name}
                className="h-full w-full object-contain grayscale transition-all hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
