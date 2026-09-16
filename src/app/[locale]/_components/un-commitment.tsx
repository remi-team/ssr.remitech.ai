"use client";

import * as React from "react";
import { IMAGES } from "./images";

/**
 * UNCommitment — migrated from "Our Commitment to the UN Global Compact".
 * SDG 10.c commitment + partner logos. Pixel-parity with the legacy Vue
 * `home/index.vue` commitment section: the mini logo sits in a 60px box with
 * 10px padding, the goals logo keeps its natural aspect (`h-auto`), the SDG
 * logo uses `object-cover`, and the partner grid / spacing mirror the
 * original classes verbatim.
 */
const partners = [
  { name: "HI SUN", src: IMAGES.partners.sun },
  { name: "Sui", src: IMAGES.partners.sui },
  { name: "RFI", src: IMAGES.partners.rfi },
  { name: "Cregis", src: IMAGES.partners.cregis },
];

function SmartImg({
  src,
  alt,
  className,
  width,
  height,
}: {
  src: string;
  alt: string;
  className?: string;
  /**
   * Intrinsic pixel size. Without it the browser cannot reserve the box, so
   * every logo row jumps as the images decode (2026-09-15 re-test, 技术SEO-6);
   * `logo-goals.png` in particular rendered at `w-full h-auto` with a measured
   * height of 0 before load.
   */
  width: number;
  height: number;
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
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
    <section data-scroll="commitment" className="pt-[60px] lg:pt-[100px] pb-[80px] lg:pb-0">
      <div className="relative mx-auto max-w-[1536px] px-[24px] lg:px-[123px] bg-white">
        {/* Logos + support line — one centred block (legacy parity). */}
        <div className="text-center pb-[32px] lg:pb-[48px] max-w-[997px] mx-auto">
          <div className="flex justify-center items-center gap-[16px] sm:gap-[25px] mb-[12px]">
            <div className="w-[60px] h-[60px] p-[10px]">
              <SmartImg
                src={IMAGES.unCommitment.logoMini}
                alt="Remi logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="2" height="28" viewBox="0 0 2 28" fill="none">
                <rect width="1.49233" height="27.608" rx="0.746163" fill="#86909C" />
              </svg>
            </div>
            <div className="w-[328px]">
              <SmartImg
                src={IMAGES.unCommitment.logoGoals}
                alt="UN SDGs logo"
                width={656}
                height={120}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
          <p className="text-center text-[#4E5969] text-[16px] lg:text-[18px] leading-[1.8] inter-light">
            Remi supports the Sustainable Development Goals
          </p>
        </div>

        {/* Heading + two paragraphs. */}
        <div className="text-left md:text-center pb-[32px] lg:pb-[48px] max-w-[997px] mx-auto mt-[24px] md:mt-[32px] lg:mt-[48px]">
          <h2 className="inter-medium text-[32px] font-[500] text-[#29221D]">
            Our Commitment to the UN Global Compact
          </h2>
          <p className="mx-auto py-[12px] max-w-[1536px] text-[18px] font-[400] text-[#4E5969] inter-light">
            Remi is a participant of the United Nations Global Compact, committed to aligning our strategies and operations with the Ten Principles on human rights, labour, environment and anti-corruption.
          </p>
          <p className="mx-auto py-[12px] max-w-[1536px] text-[18px] font-[400] text-[#4E5969] inter-light">
            We are a signatory to the Forward Faster initiative and the CFO Coalition for the SDGs, advancing SDG 10.c to reduce remittance costs and expand financial inclusion for underserved communities worldwide.
          </p>
          <div className="inline-flex"></div>
        </div>

        {/* SDG 10.c logo + target text + participant line. */}
        <div className="text-left md:text-center pb-[32px] lg:pb-[48px] max-w-[997px] mx-auto">
          <div className="flex flex-col justify-center items-center gap-[25px] mb-[24px]">
            <div className="w-[214px] h-[64px]">
              <SmartImg
                src={IMAGES.unCommitment.logoSdg}
                alt="SDG logo"
                width={428}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-[#4E5969] text-[18px] leading-[1.8] inter-light">
              By 2030, reduce to less than 3 per cent the transaction costs of migrant remittances and eliminate remittance corridors with costs higher than 5 per cent
            </div>
          </div>
          <p className="text-[#4E5969] text-[18px] leading-[1.8] inter-light">
            Participant since May 2026 · Forward Faster · CFO Coalition for the SDGs
          </p>
        </div>
      </div>

      {/* Partner logos. */}
      <div className="mx-auto flex flex-col lg:flex-row max-w-[1536px] flex-wrap items-center justify-center gap-[16px] px-[24px]">
        <div className="grid grid-cols-2 md:flex md:flex-wrap items-center justify-center gap-[5px] lg:gap-[30px]">
          {partners.map((p) => (
            <div key={p.name} className="md:w-[260px] md:h-[126px]">
              <SmartImg
                src={p.src}
                alt={p.name}
                width={520}
                height={252}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
